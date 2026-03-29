import {Router} from "express"
import { sendMessage ,getChats ,getMessages } from "../controllers/chat.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"

const chatRoutes = Router()

chatRoutes.post("/message",authMiddleware,sendMessage)
chatRoutes.get("/get-chats",authMiddleware,getChats)
chatRoutes.get("/messages/:chatId",authMiddleware,getMessages)


export default chatRoutes