import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorResponse } from "../../helper/responce";
import { CustomError } from "../../helper/customeError";
import { ErrorCodes } from "../../const/code";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string | object; // This can hold either the decoded JWT payload or a string (if token is just a user ID)
}

function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.header("Authorization");

  
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return errorResponse(res, "Your session has expired! Please log in again.", "Token not found", 401);
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_Token_Key || "");

   
    req.user = decoded;
    
    
    next();
  } catch (err: unknown) {
    
    if (err instanceof jwt.JsonWebTokenError) {
      return errorResponse(res, "Invalid token. Please log in again.", [{ message: err.message }], 401);
    } 
    if (err instanceof jwt.TokenExpiredError) {
      return errorResponse(res, "Token has expired. Please log in again.", [{ message: err.message }], 401);
    } 
    if (err instanceof CustomError) {
      return errorResponse(res, err.message, [{ message: err.message }], err.statusCode);
    }

   
    const customError = new CustomError("An unexpected error occurred", 500, ErrorCodes.INTERNAL_SERVER_ERROR);
    return errorResponse(res, "An unexpected error occurred", [{ message: customError.message }], customError.statusCode);
  }
}

export default verifyToken;
