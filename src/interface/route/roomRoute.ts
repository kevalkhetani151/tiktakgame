import { Router,Request,Response,NextFunction } from "express";
import RoomController from "../controller/roomController";
import verifyToken from "../middlewares/auth";

const route:Router = Router();


const roomController =  new RoomController();

route.post('/createRoom',verifyToken,(req:Request,resp:Response,next:NextFunction)=> roomController.CreateRoom(req,resp,next))
route.get('/publicrooms',(req:Request,resp:Response,next:NextFunction)=> roomController.PublicRooms(req,resp,next))
route.get('/allrooms',verifyToken,(req:Request,resp:Response,next:NextFunction)=> roomController.FindById(req,resp,next))
route.get('/roomavilable/:id',verifyToken,(req:Request,resp:Response,next:NextFunction)=> roomController.Roomavilable(req,resp,next))
route.get('/ranking',verifyToken,(req:Request,resp:Response,next:NextFunction)=> roomController.Ranking(req,resp,next))
export { route as roomRoute };