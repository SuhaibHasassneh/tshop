import mongoose, {Schema , model} from "mongoose"

const userSchema = new Schema(
    {
        userName:{
            type:String,
            required:true,
            min:3,
            max:50,
        },
        email:{
            type:String,
            required:true,
            unique:true, 
        },
        password:{
            type:String,
            required:true,
            min:4,
        },
        image:{
            type:Object,
        },
        phone:{
            type:String,
        },
        address:{
            type:String,
        },
        confirmEmail:{
            type:String,
            default:false
        },
        gender:{
            type:String,
            enum:['Male','Female']
        },
        status:{
            type:String,
            enume:['active','not_acteve']
        },
        role:{
            type:String,
            default:'user',
            enum:['admin','user']
        },
        sendCode:{
            type:String,
            default:null,
        }
    },
    {
        timestamps:true,
    }
);

const usermodel = mongoose.model.User || model('User',userSchema);

export default usermodel;

