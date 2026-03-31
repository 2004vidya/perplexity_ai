import {createSlice} from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null,
        
    },
    reducers:{
        createNewChat:(state,action)=>{
            const {chatId,title} = action.payload;
            state.chats[chatId] = {
                messages:[],
                id:chatId,
                title:title,
                lastUpdated:new Date().toISOString()
            }
        },
        addNewMessage:(state,action)=>{
            const {chatId,content,role} = action.payload;
            state.chats[chatId].messages.push({content,role});
            state.chats[chatId].lastUpdated = new Date().toISOString();
        }
        ,setChats:(state,action)=>{
            state.chats = action.payload;
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId = action.payload;
        },
        setIsLoading:(state,action)=>{
            state.isLoading = action.payload;
        },
        setError:(state,action)=>{
            state.error = action.payload;
        }
    }
})

export const {setChats,setCurrentChatId,createNewChat,setIsLoading,setError,addNewMessage} = chatSlice.actions;
export default chatSlice.reducer;


// chats={
//     "docker and Aws":{
//         messages:[
//             {
//                 role:"user",
//                 content:"Hello"
//             },
//             {
//                 role:"ai",
//                 content:"Hi"
//             }
//         ],
//         id:"1",
//         lastUpdated:"2m ago"
//     }
// }