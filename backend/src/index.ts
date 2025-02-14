import express, { Application } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db'
import studentRoutes from './routes/studentRoutes'
import adminRoutes from './routes/adminRoutes'
import tutorRoutes from './routes/tutorRoutes'
import categoryRoutes from './routes/categoryRoutes'
import { morganMiddleware,logger } from './middlewares/centralisedLogs'
import courseRoutes from './routes/courseRoutes'
import lectureRoutes from './routes/lectureRoutes'
import enrollmentRoutes from './routes/enrollmentRoutes'
import webhookRoutes from './routes/webhookRoutes'
import Stripe from 'stripe'



const app:Application = express()

connectDB()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
})
);

app.use('/webhook',express.raw({type:"application/json"}),webhookRoutes);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//add morgan middleware for logging
app.use(morganMiddleware);


app.use('/',studentRoutes);
app.use('/',adminRoutes);
app.use('/',tutorRoutes);
app.use('/',categoryRoutes);
app.use('/',courseRoutes);
app.use('/',lectureRoutes);
app.use('/',enrollmentRoutes);



app.get('/',(req,res)=>{
    res.send('hello')
})

const port  = process.env.PORT || 3000
app.listen(port,()=>{
    logger.info(`Server is running on port ${port}`);
    console.log(`server is running on port ${port}`);
    
});