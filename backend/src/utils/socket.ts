import {Server as SocketIOServer} from 'socket.io';
import http from 'http';
import Message from '../models/messageModel'
import MessageRoom from '../models/messageRoomModel';
import mongoose from 'mongoose';

export interface IMessageRoom extends Document{
    users: string[];
}
export const initializeSocket = (server:http.Server)=>{
    const io= new SocketIOServer(server,{
        cors:{
            origin:'http://localhost:5173',
            methods:['GET','POST']
        }
    })

    io.on('connection',(socket)=>{
        console.log(`User connected: ${socket.id}`);
       

        const getOrCreateRoom = async(senderId:string, recipientId:string):Promise<string>=>{
            console.log("create room");
            
            let room =await MessageRoom.findOne({
                users:{$all: [senderId,recipientId]},
            }).select("_id");

            if(!room){
                room = new MessageRoom({users:[senderId,recipientId]});
                await room.save()
            }
            return (room._id as mongoose.Types.ObjectId).toString();
        }
        socket.on("joinroom", async({senderId,recipientId})=>{
            console.log("join room",senderId,recipientId);
            
            const roomId = await getOrCreateRoom(senderId,recipientId);
            socket.join(roomId.toString())
            console.log("joined room",roomId);
            console.log(`${socket.id} joined room: ${roomId}`);

            
        })
        socket.on("message", async({senderId,recipientId,message,fileUrl,fileType})=>{
            console.log("messageeee");  
            const roomId = await getOrCreateRoom(senderId,recipientId);

            const newMessage = new Message({
                senderId,
                recipientId,
                message,
                roomId,
                read:false,
                fileUrl:fileUrl || null,
                fileType: fileType || null
            })
            await newMessage.save();

            await MessageRoom.findByIdAndUpdate(roomId,{lastMessage:message,lastMessageAt:new Date()},{new :true});
            console.log("Emitting receive_message to room:", roomId);


            io.to(roomId.toString()).emit("receive_message",{
                ...newMessage.toObject(),
                timestamp:newMessage.timestamp.toISOString()
            });

            const unreadCounts = await Message.aggregate([
                    {
                        $match:{
                            recipientId,
                            read:false
                        }
                    },
                    {
                        $group:{
                            _id:"$senderId",
                            count:{$sum:1}
                        }
                    },
            ]);
            io.to(roomId.toString()).emit("unread_count_update",unreadCounts);
        }
        
    );
    socket.on("message_read",async({senderId,recipientId})=>{
        const roomId = await getOrCreateRoom(senderId,recipientId);
        const currentTime = new Date()
        await Message.updateMany(
            {roomId, senderId:recipientId,recipientId:senderId,read:false},
            {$set:{read:true, readAt:currentTime}}
        )
        const unreadCounts = await Message.aggregate([
            {
                $match:{
                    recipientId:senderId,
                    read:false
                },
            },
            {
                $group:{
                    _id:"$senderId",
                    count:{$sum:1}
                }
            },
        ]);
        io.to(roomId.toString()).emit("message_read",{
            senderId:recipientId,
            recipientId:senderId,
            readAt:currentTime
        })
        io.to(roomId.toString()).emit("unread_count_update",unreadCounts);
    });
    socket.on("delete_message",async({messageId,senderId})=>{
        try {
            const message = await Message.findById(messageId);
            if(!message){
                return;
            }
            await Message.findByIdAndUpdate(messageId,{
                message:"This message was deleted"
            });
            io.to(message.roomId.toString()).emit("message_deleted",{messageId});
        } catch (error) {
            console.error("Failed to delete message")
            
        }
    });
    socket.on("get_unread_count",async({userId})=>{
        const unreadCounts = await Message.aggregate([
            {
                $match:{
                    recipientId:userId,
                    read:false
                }
            },
        ]);
        socket.emit("unread_count_update",unreadCounts)
    })

 
    })
   
    
}
