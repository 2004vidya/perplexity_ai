import { initializeSocket } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setIsLoading, setError, createNewChat, addNewMessage, setChatMessages } from "../chat.slice";

import { useDispatch } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch();

   async function handleSendMessage({message,chatId}){
        dispatch(setIsLoading(true));
        const data = await sendMessage({message,chatId});
        const { chat, aiMessage } = data;  // backend returns { chat, aiMessage, title }

        // chat is only returned when a new chat is created (no chatId passed)
        if(chat) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title
            }));
            dispatch(setCurrentChatId(chat._id));
        }

        const activeChatId = chat?._id || chatId;
        dispatch(addNewMessage({
            chatId: activeChatId,
            content: message,
            role: "user"
        }));
        dispatch(addNewMessage({
            chatId: activeChatId,
            content: aiMessage.content,
            role: "ai"
        }));
        dispatch(setError(null));
        dispatch(setIsLoading(false));
        return data;
    }

    async function handleGetChats(){
        dispatch(setIsLoading(true));
        const data = await getChats();
        const {chats}= data;
        dispatch(setChats(chats.reduce((acc,chat)=>{
            acc[chat._id] = {
                id:chat._id,
                title:chat.title,
                messages:[],
                lastUpdated:chat.updatedAt
            };
            return acc;
        },{})));
        dispatch(setError(null));
        dispatch(setIsLoading(false));
        
    }
    
    async function handleGetMessages(chatId){
        dispatch(setIsLoading(true));
        const data = await getMessages(chatId);
        const { messages } = data;
        // Store fetched messages into Redux for this chat
        dispatch(setChatMessages({ chatId, messages }));
        dispatch(setIsLoading(false));
        return messages;
    }

    return{
        initializeSocket,
        handleSendMessage,
        handleGetChats,
        handleGetMessages,
    }

}    