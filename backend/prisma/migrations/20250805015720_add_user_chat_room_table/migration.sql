-- CreateTable
CREATE TABLE "user_chat_room" (
    "user_chat_room_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(50) NOT NULL,
    "chat_room_id" VARCHAR(50) NOT NULL,

    CONSTRAINT "user_chat_room_pkey" PRIMARY KEY ("user_chat_room_id")
);

-- AddForeignKey
ALTER TABLE "user_chat_room" ADD CONSTRAINT "user_chat_room_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_room"("chat_room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_chat_room" ADD CONSTRAINT "user_chat_room_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
