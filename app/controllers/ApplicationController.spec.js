const ApplicationController = require("./ApplicationController");
const {NotFoundError} = require('../errors');

describe('/handleGetRoot', () => {
    it('should responds with json and 200 status',
        async () => {
          const mockRequest = {};
          const mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
          };

          const controller = new ApplicationController();
          await controller.handleGetRoot(mockRequest, mockResponse);

          expect(mockResponse.status).toHaveBeenCalledWith(200);
          expect(mockResponse.json).toHaveBeenCalledWith({
            status: 'OK',
            message: 'BCR API is up and running!',
          });
        },
    );
});

describe('/handleNotFound', () => {
    it('should responds with json and 404 status' + ' and error object(name, message, details)',
    async () => {

      const mockRequest = {
        method : 'POST', 
        url : '/notapage',
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const controller = new ApplicationController();
      await controller.handleNotFound(mockRequest, mockResponse);
      const err = new NotFoundError(mockRequest.method, mockRequest.url);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details,
        },
      });
    });
});

describe('/handleError', () => {
    it('should responds with json and 500 status' + ' and error object(name, message, details)',
    async () => {
      const err = new Error('Some Error');

      const mockRequest = {};
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const mockNext = jest.fn();

      const controller = new ApplicationController();
      await controller.handleError(err, mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details || null,
        },
      });
    },
    );
});

describe('/getOffsetFromRequest', () => {
    it('should return offset value',
        async () => {
          const page = Math.floor(Math.random() * 10 + 1);
          const pageSize = Math.floor(Math.random() * 10 + 1);

          const mockRequest = {query: {page, pageSize}};

          const controller = new ApplicationController();
          const returnValue = await controller.getOffsetFromRequest(mockRequest);

          const expectedValue = (page - 1) * pageSize;
          expect(returnValue).toBe(expectedValue);
        },
    );
  });

  describe('/builldPaginationObject', () => {
    it('should return correct pagination object',
        async () => {
          const page = Math.floor(Math.random() * 10 + 1);
          const pageSize = Math.floor(Math.random() * 10 + 1);
          const count = Math.floor(Math.random() * 10 + 1);

          const mockRequest = {query: {page, pageSize}};

          const controller = new ApplicationController();
          const returnValue = await controller.buildPaginationObject(
              mockRequest, count,
          );

          const pageCount = Math.ceil(count / pageSize);
          expect(returnValue).toEqual({
            page,
            pageCount,
            pageSize,
            count,
          });
        });
  });


