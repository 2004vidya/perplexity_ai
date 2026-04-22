import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import http from "http";
import {initSocket} from "./src/sockets/server.socket.js";
import dotenv from "dotenv";
dotenv.config();

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB();



httpServer.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server is running on port", process.env.PORT || 3000);
});