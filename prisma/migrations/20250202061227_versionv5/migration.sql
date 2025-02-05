/*
  Warnings:

  - The values [PUBLIC,PRIVATE] on the enum `RoomType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `Key` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoomType_new" AS ENUM ('public', 'private');
ALTER TABLE "Room" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Room" ALTER COLUMN "type" TYPE "RoomType_new" USING ("type"::text::"RoomType_new");
ALTER TYPE "RoomType" RENAME TO "RoomType_old";
ALTER TYPE "RoomType_new" RENAME TO "RoomType";
DROP TYPE "RoomType_old";
ALTER TABLE "Room" ALTER COLUMN "type" SET DEFAULT 'public';
COMMIT;

-- DropIndex
DROP INDEX "Room_Key_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "Key",
ADD COLUMN     "key" TEXT,
ALTER COLUMN "type" SET DEFAULT 'public';

-- CreateIndex
CREATE UNIQUE INDEX "Room_key_key" ON "Room"("key");
