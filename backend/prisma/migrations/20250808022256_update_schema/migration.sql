/*
  Warnings:

  - A unique constraint covering the columns `[latestMessageAt,chat_room_id]` on the table `chat_room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[created_at,message_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "chat_room" ADD COLUMN     "latestMessage" TEXT,
ADD COLUMN     "latestMessageAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_chat_room" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "chat_room_latestMessageAt_chat_room_id_key" ON "chat_room"("latestMessageAt", "chat_room_id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_created_at_message_id_key" ON "messages"("created_at", "message_id");
