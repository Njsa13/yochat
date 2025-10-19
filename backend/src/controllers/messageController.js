import { Prisma } from "@prisma/client";

import cloudinary from "../config/cloudinary.js";
import prisma from "../prisma/client.js";

export const getContacts = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { cursorChatRoomId, cursorLatestMessageAt, search, isUnread } =
      req.query;

    const limit = 10;
    const chatRooms = await prisma.chatRoom.findMany({
      take: limit + 1,
      ...(cursorChatRoomId &&
        cursorLatestMessageAt && {
          skip: 1,
          cursor: {
            latestMessageAt_chatRoomId: {
              latestMessageAt: new Date(cursorLatestMessageAt),
              chatRoomId: cursorChatRoomId,
            },
          },
        }),
      where: {
        AND: [
          {
            userChatRoom: {
              some: {
                userId: userId,
              },
            },
          },
          {
            ...(search && {
              userChatRoom: {
                some: {
                  userId: { not: userId },
                  user: {
                    OR: [
                      { fullName: { contains: search, mode: "insensitive" } },
                      { email: { contains: search, mode: "insensitive" } },
                      { username: { contains: search, mode: "insensitive" } },
                    ],
                  },
                },
              },
            }),
          },
          {
            ...(isUnread && {
              messages: {
                some: {
                  userId: { not: userId },
                  isRead: !isUnread,
                },
              },
            }),
          },
        ],
      },
      include: {
        userChatRoom: {
          where: {
            userId: {
              not: userId,
            },
          },
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                userId: { not: userId },
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: [
        {
          latestMessageAt: "desc",
        },
        {
          chatRoomId: "desc",
        },
      ],
    });

    const result = chatRooms.map((val) => ({
      chatRoomId: val.chatRoomId,
      partnerChat: val.userChatRoom[0]?.user,
      latestMessage: val.latestMessage || "No message",
      isTherePicture: val.isTherePicture,
      latestMessageAt: val.latestMessageAt,
      unread: val._count.messages,
    }));
    const hasNextPage = result.length > limit;

    res.status(200).json({
      data: result.slice(0, limit),
      hasNextPage,
    });
  } catch (error) {
    console.error("Error in getContacts function: ", error);
    next(error);
  }
};

export const getSingleContact = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { userId } = req.user;

    const user = await prisma.user.findFirst({
      where: { email, isEmailVerified: true },
    });

    if (!user || !user.isEmailVerified) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    if (userId === user.userId) {
      const err = new Error("Cannot chat with yourself");
      err.status = 422;
      return next(err);
    }

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        AND: [
          {
            userChatRoom: { some: { userId } },
          },
          {
            userChatRoom: { some: { userId: user.userId } },
          },
        ],
      },
    });

    let data = null;

    if (chatRoom) {
      data = {
        chatRoomId: chatRoom.chatRoomId,
        partnerChat: {
          fullName: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      };
    } else {
      data = {
        chatRoomId: null,
        partnerChat: {
          fullName: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      };
    }

    res.status(200).json({
      data,
    });
  } catch (error) {
    console.error("Error in getSingleContact function: ", error);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { chatRoomId } = req.params;
    const { cursorSentAt, cursorMessageId } = req.query;

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        chatRoomId,
        userChatRoom: {
          some: { userId },
        },
      },
    });

    if (!chatRoom) {
      const err = new Error("Chat room not found");
      err.status = 404;
      return next(err);
    }

    const limit = 15;
    const messages = await prisma.message.findMany({
      take: limit + 1,
      ...(cursorMessageId &&
        cursorSentAt && {
          skip: 1,
          cursor: {
            createdAt_messageId: {
              createdAt: new Date(cursorSentAt),
              messageId: cursorMessageId,
            },
          },
        }),
      where: { chatRoomId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          messageId: "desc",
        },
      ],
    });

    const result = messages.map((val) => ({
      messageId: val.messageId,
      senderEmail: val.user.email,
      text: val.text,
      image: val.image,
      sentAt: val.createdAt,
    }));
    const hasNextPage = result.length > limit;

    res.status(200).json({
      data: result.slice(0, limit),
      hasNextPage,
    });
  } catch (error) {
    console.error("Error in getMessages function: ", error);
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { text, image } = req.body;
    const { email } = req.params;

    if (!text && !image) {
      const err = new Error("At least one of text or image must be provided");
      err.status = 400;
      return next(err);
    }

    const chatPartner = await prisma.user.findUnique({
      select: { userId: true, isEmailVerified: true },
      where: { email },
    });

    if (!chatPartner || !chatPartner.isEmailVerified) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    if (userId === chatPartner.userId) {
      const err = new Error("Cannot send message to yourself");
      err.status = 422;
      return next(err);
    }

    let chatRoom = (
      await prisma.$queryRaw(
        Prisma.sql`
          select c.chat_room_id 
          from chat_room c
          join user_chat_room uc 
          on c.chat_room_id = uc.chat_room_id
          where uc.user_id in (${Prisma.join([userId, chatPartner.userId])})
          group by c.chat_room_id
          having count(distinct uc.user_id) = 2
        `
      )
    )[0];

    let unread = 0;

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          latestMessage: text || "",
          isTherePicture: Boolean(image),
          latestMessageAt: new Date(),
        },
      });
      await prisma.userChatRoom.createMany({
        data: [
          { userId, chatRoomId: chatRoom.chatRoomId },
          { userId: chatPartner.userId, chatRoomId: chatRoom.chatRoomId },
        ],
      });
    } else {
      chatRoom = await prisma.chatRoom.update({
        where: { chatRoomId: chatRoom.chat_room_id },
        data: {
          latestMessage: text || "",
          isTherePicture: Boolean(image),
          latestMessageAt: new Date(),
        },
      });

      unread = await prisma.message.count({
        where: {
          userId: chatPartner.userId,
          chatRoomId: chatRoom.chatRoomId,
          isRead: false,
        },
      });
    }

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const message = await prisma.message.create({
      data: {
        text,
        image: imageUrl,
        userId,
        chatRoomId: chatRoom.chatRoomId,
      },
    });

    res.status(200).json({
      message: "Message successfully sent",
      data: {
        messageId: message.messageId,
        senderEmail: req.user.email,
        text: message.text,
        image: message.image,
        sentAt: message.createdAt,
        unread,
      },
    });
  } catch (error) {
    console.error("Error in sendMessage function: ", error);
    next(error);
  }
};
