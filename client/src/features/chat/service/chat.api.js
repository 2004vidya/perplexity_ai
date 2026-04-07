import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})

export const sendMessage = async ({message,chatId}) => {
    const response = await api.post("/api/chats/message",{message,chat:chatId});
    return response.data;
}

export const getChats = async () => {
    const response = await api.get("/api/chats/get-chats");
    return response.data;
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/messages/${chatId}`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/${chatId}`);
    return response.data;
}


export default api;