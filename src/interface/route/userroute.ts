// src/interface/routes/bookRoutes.ts
import { Router } from "express";
import UserController from "../controller/userController";

const router = Router();

const userController =  new UserController();





// route.get("/users",verifyToken,(req, res) => userController.sampleExample(req, res));
router.post("/register",(req, res,next) => userController.registerUser(req, res,next));
router.post("/login",(req, res,next) => userController.Login(req, res,next));


export { router as userRoute };