import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,
        trim:true
    }
    // messages:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Message"
    // }
},{timestamps:true})

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;