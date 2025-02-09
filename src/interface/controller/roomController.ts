import {Request,Response,NextFunction} from 'express'
import { RoomRepository } from '../../infastructure/repositories/RoomRepository';
import { CustomError } from '../../helper/customeerror';
import { ErrorCodes } from '../../const/code';
import { errorResponse, successResponse } from '../../helper/responce';
class RoomController {

    private room = new RoomRepository();
    public async CreateRoom(req: Request, res: Response, next: NextFunction) {
        console.log("room api is called")
        //@ts-ignore
        const _id = req.user.userId;
        try {
            const userData = await this.room.createRoom({ ...req.body,createdById:_id
            });
            return successResponse(res, 'Room created successfully', userData);
        } catch (err: any) {
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
    public async PublicRooms(req: Request, res: Response, next: NextFunction){
        try {
            const userData = await this.room.findPublicRooms();
            return successResponse(res, 'Room Get successfully', userData);
        } catch (err: any) {
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
    public async FindById(req: Request, res: Response, next: NextFunction){
        //@ts-ignore
        const _id = req.user.userId;
        try {
            const RoomData = await this.room.findById(parseInt(_id));
            return successResponse(res, 'Fetch ALl Room sucessfully', RoomData);
        } catch (err: any) {
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
    public async Roomavilable(req:Request,resp:Response,next:NextFunction){
        try {
            console.log("room id is here")
            console.log(req.params.id)
            const RoomData = await this.room.findRoomavilable(req.params.id);
            console.log(RoomData.length)
            if(RoomData.length == 0){
                return errorResponse(resp, 'No room found', 400);
            }
            // if(!RoomData){
            //     return errorResponse(resp, 'please enter a valid private key', 400);
            // }
            return successResponse(resp, 'found room', RoomData);
        } catch (err) {
            if (err instanceof CustomError) {
                return errorResponse(resp, err.message, [{ message: err.message }], err.statusCode);
            } else if (err instanceof Error) {
                const customError = new CustomError(err.message, 500, ErrorCodes.INTERNAL_SERVER_ERROR);
                return errorResponse(resp, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
            } else {
                const customError = new CustomError('Unknown error occurred', 500, ErrorCodes.INTERNAL_SERVER_ERROR);
                return errorResponse(resp, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
            }
        }
    }
    public async Ranking(req:Request,resp:Response,next:NextFunction){
        try {
            console.log("room id is here")
            console.log(req.params.id)
            const EmployeData = await this.room.RankingPlayers();

            return successResponse(resp, 'found room', EmployeData);
        } catch (err) {
            if (err instanceof CustomError) {
                return errorResponse(resp, err.message, [{ message: err.message }], err.statusCode);
            } else if (err instanceof Error) {
                const customError = new CustomError(err.message, 500, ErrorCodes.INTERNAL_SERVER_ERROR);
                return errorResponse(resp, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
            } else {
                const customError = new CustomError('Unknown error occurred', 500, ErrorCodes.INTERNAL_SERVER_ERROR);
                return errorResponse(resp, 'An unexpected error occurred', [{ message: customError.message }], customError.statusCode);
            }
        }
    }
    
    
}

export default RoomController