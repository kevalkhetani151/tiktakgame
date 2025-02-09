import { Response, Request, NextFunction } from "express";
import { errorResponse, successResponse } from "../../helper/responce";
import { InMemoryUserRepository } from "../../infastructure/repositories/UserRepository";

import { ErrorCodes } from "../../const/code";
import Encryptncryptpassword from "../../helper/encryptpassword";
import JwtToken from "../../helper/jwtToken";
import _ from "lodash";
// import { CustomError } from "../../helper/customeError";
import { CustomError } from "../../helper/customeerror";

class UserController {
   private userRepositry = new InMemoryUserRepository();

    public async registerUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const existingUser = await this.userRepositry.findByEmail(req.body.email);
            if (existingUser) {
                return errorResponse(res, 'Email address already exists', [], 400);
            }

            const userData = await this.userRepositry.create(req.body);
            return successResponse(res, 'User created successfully', userData);
        } catch (err) {
            if (err instanceof CustomError) {
                return errorResponse(res, err.message, [{ message: err.message }], err.statusCode);
            } else if (err instanceof Error) {
                const customError = new CustomError(err.message, 500, ErrorCodes.INTERNAL_SERVER_ERROR);
                return errorResponse(res, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
            } else {
                const customError = new CustomError('Unknown error occurred', 500, ErrorCodes.INTERNAL_SERVER_ERROR);
                return errorResponse(res, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
            }
        }
    }
    public async Login(req: Request, resp: Response, next?: NextFunction) {
     

        try {
          
          const userdata = await this.userRepositry.findByEmail(req.body.email)
          if (!userdata) {
            errorResponse(resp, "user is not found", 404)
            return;
          }
          const dycryptpass = Encryptncryptpassword.dycrypt(req.body.password, userdata.password, userdata.salt)
    
          if (dycryptpass) {
            const jwttoken = JwtToken.createJwt({ userId: userdata?.id }, "b1f3d9e8234c57f8a0d2e4a5c6b7e8f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7", {
              expiresIn: '1h',
            })
            successResponse(resp, "Login sucessfully", _.omit({
              ...userdata,
              token: jwttoken
            }, ["password", "salt"]))
            return true;
          } else {
            errorResponse(resp, "user doesn't exit", 404);
            return false
          }
    
        }
        catch (err) {
         if (err instanceof CustomError) {
            return errorResponse(resp, err.message, [{ message: err.message }], err.statusCode);
          }
          else if (err instanceof Error) {
            const customError = new CustomError(err.message, 500, ErrorCodes.INTERNAL_SERVER_ERROR);
            return errorResponse(resp, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
          }
          else {
            const customError = new CustomError('Unknown error occurred', 500, ErrorCodes.INTERNAL_SERVER_ERROR);
            return errorResponse(resp, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
          }
        }
    
    
    
      }
}

export default UserController;
