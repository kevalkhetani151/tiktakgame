/*
  Warnings:

  - You are about to drop the `GameRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameRoomPlayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "GameRoom" DROP CONSTRAINT "GameRoom_createdById_fkey";

-- DropForeignKey
ALTER TABLE "GameRoomPlayers" DROP CONSTRAINT "GameRoomPlayers_gameRoomId_fkey";

-- DropForeignKey
ALTER TABLE "GameRoomPlayers" DROP CONSTRAINT "GameRoomPlayers_userId_fkey";

-- DropTable
DROP TABLE "GameRoom";

-- DropTable
DROP TABLE "GameRoomPlayers";

-- DropEnum
DROP TYPE "GameStatus";

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'room 1',
    "type" "RoomType" NOT NULL DEFAULT 'PUBLIC',
    "Key" TEXT,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_Key_key" ON "Room"("Key");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
