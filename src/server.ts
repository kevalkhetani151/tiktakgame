import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { userRoute } from "./interface/route/userroute";
import { roomRoute } from "./interface/route/roomRoute";
import { errorHandler } from "./interface/middlewares/errorHanddler";
import { GameController } from "./interface/controller/GameController";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 3090;
const url = process.env.URL || "http://localhost";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

interface CustomSocket extends Socket {
  user?: any; // Replace `any` with a proper type for `decoded`
}

// Initialize GameController
const gameController = new GameController(io);

// Default route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

io.use((socket: CustomSocket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_Token_Key || "", (err:any, decoded:any) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    
    socket.user = decoded;
    next(); 
  });
});
// Socket.IO connection handling
io.on("connection", (socket: CustomSocket) => {

  console.log("New player connected:", socket.id);

  socket.on("joinRoom", (slug: string) => gameController.handleJoinRoom(socket, slug,socket.user?.userId));
  socket.on("makeMove", ({ slug, index }: { slug: string; index: number }) => gameController.handleMove(socket, slug, index));
  socket.on("resetGame", (slug: string) => gameController.handleReset(slug));
  socket.on("disconnect", () => gameController.handleDisconnect(socket));
});

// Routes
app.use("/user", userRoute);
app.use("/room", roomRoute);

// Error handling middleware
app.use(errorHandler);

// Start the server
server.listen(port, () => {
  console.log(`Server running at ${url}:${port}`);
});
