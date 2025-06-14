import cors from 'cors';
import connectDb from '../DB/connection.js';
import authRouter from './moduls/auth/auth.router.js'
const initApp = async(app,express)=>{

    app.use(express.json());
    app.use(cors());
    connectDb();
    app.get('/',(req,res)=>{
        return res.status(200).json({Message:"Welcome ..."});
    });

    app.use('/auth',authRouter)

    app.use((req,res)=>{
        return res.status(404).json({Message:"Page not found !!!"})
    })
}

export default initApp;