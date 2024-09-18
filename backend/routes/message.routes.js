const mongoose = require("mongoose");
const express = require("express");
const { authentication } = require("../middlewares/auth.middleware");
const MessageModel = require("../models/messaging.models");
const messageRouter = express.Router();

messageRouter.post("/send", authentication, async (req, res) => {
  const { text, receiver } = req.body;
  const sender = req.body.userId;
  if (!text || !receiver || !receiver) {
    res.status(400).json({ error: "Text and receiver are required" });
  }
  try {
    const message = new MessageModel({ text, sender, receiver });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
});

messageRouter.get("/user/:chatId/:userId", authentication, async (req, res) => {
  const { chatId, userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: "Invalid chat ID" });
  }

  try {
    const messages = await MessageModel.find({
      $or: [
        { sender: userId, receiver: chatId },
        { sender: chatId, receiver: userId },
      ],
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});







messageRouter.get("/", authentication, async (req, res) => {
  const userId = req.body.userId;
  console.log("Fetching messages for sender:", userId);
  try {
    const messages = await MessageModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });
   
    console.log("Messages with staticUserId:", messages);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error Fetching message" });
  }
});

messageRouter.post("/reply", authentication, async (req, res) => {
  const { parentmessageId, text, replytoId } = req.body;
  const sender = req.body.userId;
  if (!parentmessageId || !text) {
    return res
      .status(400)
      .json({ error: "parent message id and reply is required" });
  }
  try {
    const parentMessage = await MessageModel.findById(parentmessageId);
    if (!parentMessage) {
      return res.status(404).json({ error: "parent message not found" });
    }
    const reply = {
      text,
      sender,
    };

    const addNestedReply = (replies) => {
      const stack = [...replies];
      while (stack.length > 0) {
        const currentReply = stack.pop();
        if (currentReply._id.toString() === replytoId) {
          currentReply.replies.push(reply);
          return true;
        }
        if (currentReply.replies.length > 0) {
          stack.push(...currentReply.replies);
        }
      }
      return false;
    };

    if (!addNestedReply(parentMessage.replies)) {
      parentMessage.replies.push(reply);
    }

    await parentMessage.save();
    res.json({ parentMessage, reply });
  } catch (error) {
    res.status(500).json({ error: "error to send the reply" });
  }
});

messageRouter.delete(`/:id`, authentication, async (req, res) => {
  const messageId = req.params.id;
  const userId = req.body.userId;

  if (!messageId) {
    return res.status(400).json({ error: "Message id are required" });
  }

  try {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "message not found" });
    }

    if (
      message.sender.toString() !== userId &&
      message.receiver.toString() !== userId
    ) {
      return res.status(403).json({
        error: "you can only delete those message that send or received",
      });
    }

    const removemessagefromReplies = async (replies) => {
      for (let i = 0; i < replies.length; i++) {
        if (replies[i]._id.toString === messageId) {
          replies.splice(i, 1);
          return true;
        }
        if (replies[i].replies.length > 0) {
          if (await removemessagefromReplies(replies[i].reply)) {
            return true;
          }
        }
      }
      return true;
    };

    if (message.parentmessageId) {
      const parentMessage = await MessageModel.findById(
        message.parentmessageId
      );
      if (parentMessage) {
        await removemessagefromReplies(parentMessage.replies);
        await parentMessage.save();
      }
    }
    await MessageModel.findByIdAndDelete(messageId);
    res.json({ msg: "message delete successfully" });
  } catch (error) {
    console.error("error deleting the message", error);
    res.status(500).json({ error: "error deleting the message" });
  }
});

messageRouter.put("/:id", authentication, async (req, res) => {
  const messageId = req.params.id;
  const userId = req.body.userId;
  const { newMessage } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: "invalid message id" });
    }

    const message = await MessageModel.findById(messageId);
    if (!message) {
      res.status(400).json({ error: "message not message" });
    }

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({
          error: "you can only delete those message that send or received",
        });
    }

    if (newMessage) {
      message.text = newMessage;
    }
    await message.save();
    res
      .status(200)
      .json({
        message: "message  updated succesfully",
        updatedMessage: message,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error updating the message", error: error.message });
  }
});

module.exports = {
  messageRouter,
};
