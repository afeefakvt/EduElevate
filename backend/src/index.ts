import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import studentRoutes from './routes/studentRoutes'
import adminRoutes from './routes/adminRoutes'
import tutorRoutes from './routes/tutorRoutes'
import categoryRoutes from './routes/categoryRoutes'



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

app.use('/',studentRoutes)
app.use('/',adminRoutes)
app.use('/',tutorRoutes)
app.use('/',categoryRoutes)

app.get('/',(req,res)=>{
    res.send('hello')
})

const port  = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})