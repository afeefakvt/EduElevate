import { Router } from "express";
import Message from '../models/messageModel'
import MessageRoom from '../models/messageRoomModel';
import { upload,uploadVideo } from "../config/cloudinary";
import { authenticateToken } from "../middlewares/authToken";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { authorizeRoles } from "../middlewares/authRole";

const messageRoutes = Router()

messageRoutes.get('/messages/:senderId/:recipientId',authenticateToken ,authorizeRoles(["tutor","student"]), async(req,res):Promise<void>=>{
    const {senderId,recipientId} = req.params;

    const room = await MessageRoom.findOne({
        users:{$all: [senderId,recipientId]}
    });

    if(!room){
        res.json([]);
        return;
    }
    const messages =  await Message.find({roomId:room._id})
    .select("senderId recipientId message read readAt timestamp fileUrl fileType")
    .sort({timestamp:1});
    res.json(messages)
})

messageRoutes.post('/uploadImage',upload.single("file"), async(req,res):Promise<void>=>{
    if(!req.file){
        res.status(HTTP_STATUS.BAD_REQUEST).send("No file uploaded")
        return;
    }
    const imageUrl = req.file.path
    res.status(HTTP_STATUS.OK).json({imageUrl});
    return;
})
messageRoutes.post('/uploadVideo',uploadVideo.single("file"), async(req,res):Promise<void>=>{
    if(!req.file){
        res.status(HTTP_STATUS.BAD_REQUEST).json({error:"no videos uploaded"})
        return;
    }

    const videoUrl = req.file.path;
    res.status(HTTP_STATUS.OK).json({videoUrl})
    return;
}
);


export default messageRoutes