import { generateResponse, generateTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    const { message, chat: chatId } = req.body;

    let title = null,
      chat = null;

    if (!chatId) {
      title = await generateTitle(message);
      console.log(title);
      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    } else {
      chat = await chatModel.findById(chatId);
    }

    const userMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: message,
      role: "user",
    });

    const messages = await messageModel.find({ chat: chatId || chat._id });

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: result,
      role: "ai",
    });

    console.log(messages);

    

    res.status(201).json({ aiMessage, title, chat });
  } catch (error) {
    res.status(500).json({
      message:"Internal server error"
    })
  }
}


export async function getChats(req,res){
  try {
    const user = req.user

    const chats = await chatModel.find({user:user.id})

    res.status(200).json({message:"Chats retrived successfully",chats})
  } catch (error) {
    res.status(500).json({
      message:"Internal server error"
    })
  }
}

export async function getMessages(req,res){
  try {
    const {chatId} = req.params;

    const chat = await chatModel.findOne({
      _id:chatId,
      user:req.user.id
    })
    if(!chat){
      return res.status(400).json({
        message:"Chat not found"
      })
    }

    const messages = await messageModel.find({
      chat:chatId
    })

    res.status(200).json({message:"Messages retrived successfully",messages})
    
  } catch (error) {
     res.status(500).json({
      message:"Internal server error"
    })
  }
}