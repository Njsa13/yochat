import cloudinary from "../config/cloudinary.js";
import prisma from "../prisma/client.js";

export const getContacts = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { cursorChatRoomId, cursorLatestMessageAt } = req.query;

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
        userChatRoom: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        userChatRoom: {
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
      partnerChat: val.userChatRoom
        .filter((val) => val.userId !== userId)
        .map((val) => ({
          fullName: val.user.fullName,
          email: val.user.email,
          profilePicture: val.user.profilePicture,
        }))[0],
      latestMessage: val.latestMessage || "No message",
      latestMessageAt: val.latestMessageAt,
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
    const { email } = req.param;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const err = new Error("User not found");
      err.status(404);
      next(err);
    }

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error in getSingleContact function: ", error);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { chatRoomId } = req.param;
    const { cursorCreatedAt, cursorMessageId } = req.query;

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
        cursorCreatedAt && {
          skip: 1,
          cursor: {
            createdAt_messageId: {
              createdAt: new Date(cursorCreatedAt),
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
      Image: val.image,
      sentAt: val.createdAt,
    }));
    const hasNextPage = result.length > limit;

    res.status(200).json({
      data: result,
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
    const { email } = req.param;

    if (!text && !image) {
      const err = new Error('At least one of "text" or "image" must be provided');
      err.status(400);
      return next(err);
    }

    const chatPartner = await prisma.user.findUnique({
      select: { userId: true },
      where: { email },
    });

    if (!chatPartner) {
      const err = new Error("User not found");
      err.status(404);
      return next(err);
    }

    let chatRoom = await prisma.chatRoom.findFirst({
      where: {
        userChatRoom: {
          some: {
            userId: {
              in: [chatPartner.userId, userId],
            },
          },
        },
      },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatRoom.create({
        data: {
          latestMessage: text || (image ? "Image" : ""),
        },
      });
      await prisma.userChatRoom.createMany({
        data: [
          { userId, chatRoomId: newChatroom.chatRoomId },
          { userId: chatPartner.userId, chatRoomId: newChatroom.chatRoomId },
        ],
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
        text: message.text,
        image: message.image,
        chatRoomId: message.chatRoomId,
      },
    });
  } catch (error) {
    console.error("Error in sendMessage function: ", error);
    next(error);
  }
};
