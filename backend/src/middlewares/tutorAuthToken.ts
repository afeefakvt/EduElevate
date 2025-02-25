// import { verifyToken } from "../utils/jwt";
// import { Request,Response,NextFunction } from "express";
// import { JwtPayload } from "jsonwebtoken";
// import Tutor, { ITutor } from "../models/tutorModel";

// interface DecodedToken extends JwtPayload{
//     id:string
// }

// interface RequestWithTutor extends Request{
//     tutor:ITutor
// }

// export const authenticateToken = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
//     // const token = req.cookies.tutorAuthToken

//     const token = req.headers.authorization?.split(" ")[1];
//     console.log("authenticating the token");
    

//     if(!token){
//         res.status(401).json({message:'token not found'})
//         return;
//     }
//     try {
//         const decoded  = verifyToken(token) as DecodedToken
//         const tutor  = await Tutor.findById(decoded.id)
        
//         if(!tutor){
//             res.status(404).json({message:'User not found'})
//             return;
//         }

//         if(tutor.isBlocked){
//             res.status(403).json({message:'Your account is blocked'})
//             return; 
//         }

//         (req as RequestWithTutor).tutor = tutor;
//         next()
//     } catch (error) {
//         res.status(403).json({message:'Token is expires. Please login again.'})
//         return;
        
//     }
// }

// export const authorizeRoles = (roles:string[])=>{
//     return (req:RequestWithTutor,res:Response,next:NextFunction)=>{
//         if(!roles.includes(req.tutor.role)){
//             res.status(403).json({message:"You don't have permission to access this resource."})
//             return;
//         }
//         next()
//     }

// }