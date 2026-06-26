import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
            withCredentials: true,
            autoConnect: true
        });

        socket.on("connect", () => {
            console.log("Connected to socket server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket server");
        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initializeSocket();
    }
    return socket;
};