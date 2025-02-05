import { Room } from "@prisma/client";
import prisma from "../../config/db.config";



export class RoomRepository {
    private rooms: Room[] = [];
    async createRoom(RoomData: Room): Promise<Room> {
      try {
        const roomData = await prisma.room.create({
          data: {
            ...RoomData,
          },
        });
    
        return roomData;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to create room: ${error.message}`);
        } else {
          throw new Error('An unexpected error occurred while creating the room.');
        }
      }
    }
    async findPublicRooms(): Promise<Room[]> {
      try {
        const rooms = await prisma.room.findMany({
          where: {
            type: 'public',
            OR: [
              { status: "View" },
              { status: "Available" }
            ]
          },
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        });
        
    
        return rooms;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch public rooms: ${error.message}`);
        } else {
          throw new Error('An unexpected error occurred while fetching public rooms.');
        }
      }
    }
    async findById(id:number): Promise<any | null> {
      try {
        const room = await prisma.room.findMany({
          where: {
            createdById: id,
          }
        });
    
        return room;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch room: ${error.message}`);
        } else {
          throw new Error('An unexpected error occurred while fetching the room.');
        }
      }
    }
    async findRoomavilable(slug:string):Promise<any>{
      try {
        const room = await prisma.room.findMany({
          where: {
            key:slug
          }
        });
    
        return room;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch room: ${error.message}`);
        } else {
          throw new Error('An unexpected error occurred while fetching the room.');
        }
      }
    }
    async RankingPlayers():Promise<any>{
      try {
        const room = await prisma.user.findMany({
          select: {
            username: true,
            win: true,
            email: true
          },
          orderBy: {
            win: 'desc'
          }
        });
    
        return room;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch room: ${error.message}`);
        } else {
          throw new Error('An unexpected error occurred while fetching the room.');
        }
      }
    }
}