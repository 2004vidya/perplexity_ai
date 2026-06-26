import { Server } from 'socket.io';
import jwt from "jsonwebtoken";
import { HumanMessage, AIMessage, SystemMessage } from "langchain";
import { agent, generateTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

let io;

const parseCookies = (cookieHeader) => {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
    return list;
};

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean),
            credentials: true
        }
    });

    console.log("Socket.io initialized");

    // Authenticate socket connections using JWT token in cookie
    io.use((socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;
            const cookies = parseCookies(cookieHeader);
            const token = cookies.token;
            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decodedToken;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("a user connected via socket:", socket.id, "user ID:", socket.user?.id);

        socket.on("send_message", async ({ message, chatId }) => {
            try {
                if (!message || !message.trim()) {
                    return socket.emit("ai_error", { message: "Message cannot be empty." });
                }

                let chat = null;
                let isNewChat = false;

                if (!chatId) {
                    isNewChat = true;
                    const title = await generateTitle(message);
                    chat = await chatModel.create({
                        user: socket.user.id,
                        title,
                    });
                    chatId = chat._id.toString();
                } else {
                    chat = await chatModel.findById(chatId);
                    if (!chat) {
                        return socket.emit("ai_error", { message: "Chat session not found." });
                    }
                }

                // 1. Save user message to database
                const userMessage = await messageModel.create({
                    chat: chatId,
                    content: message,
                    role: "user",
                });

                // 2. Emit stream start event
                socket.emit("ai_stream_start", { chatId, title: chat.title });

                // 3. Load full message history
                const messages = await messageModel.find({ chat: chatId });
                const langchainMessages = messages.map((msg) => {
                    if (msg.role === "user") {
                        return new HumanMessage(msg.content);
                    } else if (msg.role === "ai") {
                        return new AIMessage(msg.content);
                    } else {
                        return new SystemMessage(msg.content);
                    }
                });

                // 4. Stream tokens using agent.streamEvents
                const eventStream = agent.streamEvents(
                    { messages: langchainMessages },
                    { version: "v2" }
                );

                let fullContent = "";

                for await (const event of eventStream) {
                    if (event.event === "on_chat_model_stream" && event.data.chunk) {
                        const content = event.data.chunk.content;
                        if (content) {
                            fullContent += content;
                            socket.emit("ai_chunk", { chatId, content });
                        }
                    }
                }

                // 5. Save finished AI response to database
                const aiMessage = await messageModel.create({
                    chat: chatId,
                    content: fullContent || "I'm here to help!",
                    role: "ai",
                });

                // 6. Emit stream end event
                socket.emit("ai_stream_end", { chatId, aiMessage });

            } catch (error) {
                console.error("Error in send_message socket handler:", error);
                socket.emit("ai_error", { message: "Internal server error generating response." });
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected:", socket.id);
        });
    });
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}