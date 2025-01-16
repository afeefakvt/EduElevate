import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'



const app:Application = express()

connectDB()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
})
);
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('hello')
})

const port  = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})