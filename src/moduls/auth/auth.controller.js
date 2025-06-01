import usermodel from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from 'jsonwebtoken';
import { nanoid, customAlphabet } from "nanoid";

export const register = async (req,res,next) => {
    
    const {userName , email, password} = req.body; 
    
    const user = await usermodel.findOne({email});

    if(user){
        return res.status(404).json({Message:"The user is already exist!!!"});
    }else{
        
        const hashedPassword = await bcrypt.hash(password , parseInt(process.env.SALT_ROUND));

        const createUser = await usermodel.create({userName,email,password:hashedPassword});

        const token = jwt.sign({email},process.env.CONFIRM_EMAIL_SIGNETURE)
        const html = `
        <div>
            <h1>Welcome ${userName}</h1>
            <h2>Confirtm Email</h2>
            <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">Press to confirm your email</a> 
        </div>
        `;
        await sendEmail(email,"Confirm Email" , html);
        return res.status(201).json({Message:"Added Successfuly",createUser});
        
    }

}

export const confirmEmail = async(req,res)=>{
    const {token} = req.params;
    const decoded = jwt.verify(token,process.env.CONFIRM_EMAIL_SIGNETURE )
    await usermodel.findOneAndUpdate({email:decoded.email},{confirmEmail:true})
    return res.status(200).json({Message:"Success ^_^"})
}

export const login = async(req,res)=>{
    
    const {email,password} = req.body;

    const user = await usermodel.findOne({email});

    if(!user){
        return res.status(400).json({Message:"invalid data"});
    }

    if(!user.confirmEmail){
        return res.status(400).json({Message:"PLZ confirm your email"});

    }

    if(user.status == 'not_active'){
        return res.status(400).json({Message:"your account is blocked"});

    }

    const match = await bcrypt.compare(password,user.password);

    if(!match){
        return res.status(400).json({Message:"invalid data"});
    }

    const token = jwt.sign({id:user._id,userName:user.userName,role:user.role},process.env.LOGIN_SIGNETURE);

    return res.status(200).json({Message:"Success",token});
}   

export const sendCode = async(req,res)=>{

    const {email} = req.body;
    const code = customAlphabet('1234567890abcdefABCDEF',4)();

    const user =await usermodel.findOneAndUpdate({email},{sendCode:code})
    const html = `<h2>Code is ${code}</h2>`
    await sendEmail(email,'Reset Password' ,html)
    return res.status(200).json({Message:"success"})
}

 export const resetPassword = async(req,res)=>{
    const {code,email,password} = req.body;

    const user = await usermodel.findOne({email});

    if(!user){
        return res.status(400).json({Message:"Not register account !!!"})
    }

    if(user.sendCode != code ){
        return res.status(400).json({Message:"Invalid Code !!!"})
    }

    const hashedPassword = await bcrypt.hash(password , parseInt(process.env.SALT_ROUND));

    user.password = hashedPassword;
    user.sendCode = null
    user.save();

    return res.status(200).json({Message:"Success" , user})



 }