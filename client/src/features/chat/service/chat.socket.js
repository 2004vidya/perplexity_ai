import { io } from "socket.io-client";

export const initializeSocket = () => {
    const socket = io("http://localhost:3000", {
        withCredentials: true,
    });

    socket.on("connect", () => {
        console.log("Connected to socket server");
    
    }
    );
}