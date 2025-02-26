import { verifyToken } from "../utils/jwt";
import { Request,Response,NextFunction } from "express";
import { IStudent, Student } from "../models/studentModel";
import { JwtPayload } from "jsonwebtoken";
import Tutor, { ITutor } from "../models/tutorModel";


interface DecodedToken extends JwtPayload{
    id:string;
    role:string;
}

export interface RequestWithUser extends Request{
    user?:IStudent| ITutor; //can be student,tutor,admin
    student?:IStudent;
    tutor?:ITutor;
}

export const authenticateToken = async(req:RequestWithUser,res:Response,next:NextFunction):Promise<void>=>{
    // const token = req.cookies.authToken

    const token  = req.headers.authorization?.split(" ")[1];
    console.log("authenticating the token");

    if(!token){
        res.status(403).json({message:'Access denied. No token provided.'})
        return;
    }

    try {
        const decoded  = verifyToken(token) as DecodedToken
        // console.log("12233w223qwdwads",decoded);
        let user;

        if(decoded.role==="student" || decoded.role==="admin"){
            user = await Student.findById(decoded.id);
            if (user) req.student = user;
            
        }else if(decoded.role==="tutor"){
            user  = await Tutor.findById(decoded.id)
            if (user) req.tutor = user;
        }

        if(!user){
             res.status(404).json({message:"User not found"})
             return;
        }
        if(user.isBlocked){
            console.log("blocjkeddnn");
            
            res.status(403).json({message:"User is blocked"})
            return;
        }
        req.user = user
        next()
    } catch (error) {
        res.status(403).json({message:'Token is expired.Please login again.'})
        return;
        
    }
}

