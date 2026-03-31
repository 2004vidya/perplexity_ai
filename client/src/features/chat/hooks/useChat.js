import { initializeSocket } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setIsLoading, setError, createNewChat, addNewMessage } from "../chat.slice";

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
    return{
        initializeSocket,
        handleSendMessage,
    }

}    