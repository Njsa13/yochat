import { Server } from "socket.io";
import http from "http";
import e from "express";
import prisma from "../prisma/client";

const app = e();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

const onlineUsers = {};

io.on("connection", async (socket) => {
  const email = socket.handshake.query.email;
  if (email) onlineUsers[email] = socket.id;

  console.log(`${email} connected`);
  await notifyFriendsStatusChange(email, "online");

  socket.on("disconnect", async () => {
    console.log(`${email} disconnected`);
    delete onlineUsers[email];

    await notifyFriendsStatusChange(email, "offline");
  });
});

function getSocketId(email) {
  return onlineUsers[email];
}

async function notifyFriendsStatusChange(email, status) {
  const chatRooms = await prisma.chatRoom.findMany({
    where: {
      userChatRoom: {
        some: {
          user: { email },
        },
      },
    },
    include: {
      userChatRoom: {
        where: {
          user: {
            email: { not: email },
          },
        },
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  const emails = chatRooms.flatMap((room) =>
    room.userChatRoom.map((ucr) => ucr.user.email)
  );

  emails.forEach((email) => {
    const friendSocket = onlineUsers[email];
    if (friendSocket)
      io.to(friendSocket).emit("friend-status-changed", { email, status });
  });
}

export { io, app, server, getSocketId };
