import userModel from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({ email });
        if(isUserAlreadyExists){
            return res.status(400).json({ message: "User with this email already exists" , success:false,err:"User already exists"});
        }

        const user = await userModel.create({ username, email, password });
        await sendEmail({
            to:email,
            subject:"Verify your email",
            text:"Please verify your email",
            html:`
            <div>
                <p>Hello ${user.username},</p>
                <p>Welcome to perplexity AI.Please verify your email by clicking on the link below</p>
                <a href="http://localhost:3000/verify-email?token=${user.verificationToken}">Verify your email</a>
            </div>
            `
        });
        
        res.status(201).json({ message: "User created successfully" , success:true,user});
    } catch (error) {
        res.status(500).json({ message: error.message, stack:error.stack });
    }
}

export {registerUser};