import Message from "../models/message.model.js";

import { uploadMedia } from "../utils/cloudinary.util.js";
import { getReceiverSocketId, io } from "../utils/socket.util.js";

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {

    const { text, image, video } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image && !video) {
      return res.status(400).json({ message: "At least one of text, image, or video is required to send a message" });
    }
    if (text.length > 500) {
      return res.status(400).json({ message: "Message is too long" });
    }
    if (image && !image.startsWith("data:image")) {
      return res.status(400).json({ message: "Invalid image format" });
    }
    if (video && !video.startsWith("data:video")) {
      return res.status(400).json({ message: "Invalid video format" });
    }

    let imageUrl, videoUrl;

    if (image) {
      const uploadResponse = await uploadMedia(image, "image", "BolMitra/Chat");
      imageUrl = uploadResponse.secure_url;
    }

    if (video) {
      const uploadResponse = await uploadMedia(video, "video", "BolMitra/Chat");
      videoUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    await newMessage.save();

    // Realtime functionality to emit new message to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
