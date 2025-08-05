/*
  Warnings:

  - The primary key for the `user_chat_room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_chat_room_id` on the `user_chat_room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_chat_room" DROP CONSTRAINT "user_chat_room_pkey",
DROP COLUMN "user_chat_room_id",
ADD CONSTRAINT "user_chat_room_pkey" PRIMARY KEY ("user_id", "chat_room_id");
