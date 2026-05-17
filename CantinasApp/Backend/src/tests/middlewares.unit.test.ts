import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret";

const { authMiddleware } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

jest.mock("jsonwebtoken");

describe("Middlewares", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe("authMiddleware", () => {
    it("should return 401 if no token is provided", () => {
      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token não fornecido"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if authorization header has no Bearer token", () => {
      mockRequest.headers = { authorization: "InvalidFormat" };

      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if token is invalid", () => {
      mockRequest.headers = { authorization: "Bearer invalidtoken" };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token inválido ou expirado"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if decoded token has no id", () => {
      mockRequest.headers = { authorization: "Bearer validtoken" };
      (jwt.verify as jest.Mock).mockReturnValue({
        role: "admin"
      });

      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token inválido"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if decoded token has no role", () => {
      mockRequest.headers = { authorization: "Bearer validtoken" };
      (jwt.verify as jest.Mock).mockReturnValue({
        id: 1
      });

      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Token inválido"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next() with valid token containing id and role", () => {
      mockRequest.headers = { authorization: "Bearer validtoken" };
      (jwt.verify as jest.Mock).mockReturnValue({
        id: 1,
        role: "admin"
      });

      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect((mockRequest as any).user).toEqual({ id: 1, role: "admin" });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should extract token from Bearer format correctly", () => {
      mockRequest.headers = { authorization: "Bearer abc123def456" };
      (jwt.verify as jest.Mock).mockReturnValue({
        id: 2,
        role: "user"
      });

      authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(
        "abc123def456",
        expect.any(String)
      );
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("authorizeRoles", () => {
    it("should return 401 if user is not authenticated", () => {
      const middleware = authorizeRoles("admin");
      (mockRequest as any).user = undefined;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Não autenticado"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 403 if user role is not authorized", () => {
      const middleware = authorizeRoles("admin", "manager");
      (mockRequest as any).user = { id: 1, role: "user" };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Sem permissão para aceder"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next() if user has one of the authorized roles", () => {
      const middleware = authorizeRoles("admin", "manager");
      (mockRequest as any).user = { id: 1, role: "admin" };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should call next() if user has any of the multiple authorized roles", () => {
      const middleware = authorizeRoles("admin", "manager", "user");
      (mockRequest as any).user = { id: 2, role: "manager" };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle single role authorization", () => {
      const middleware = authorizeRoles("admin");
      (mockRequest as any).user = { id: 1, role: "admin" };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access with single role when user has different role", () => {
      const middleware = authorizeRoles("admin");
      (mockRequest as any).user = { id: 1, role: "user" };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
