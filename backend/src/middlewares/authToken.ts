import { verifyToken } from "../utils/jwt";
import { Request,Response,NextFunction } from "express";
import { Student } from "../models/studentModel";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload{
    id:string
}
export const authenticateToken = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const token = req.cookies.authToken

    if(!token){
        res.status(401).json({message:'token not found'})
        return;
    }
    try {
        const decoded  = verifyToken(token) as DecodedToken
        console.log("12233w223qwdwads",decoded);
        const student  = await Student.findById(decoded.id)
        
        if(!student){
            res.status(404).json({message:'User not found'})
            return;
        }

        if(student.isBlocked){
            res.status(403).json({message:'Your account is blocked'})
            return; 
        }

        req.student = student;
        next()
    } catch (error) {
        res.status(403).json({message:'invalid token'})
        return;
        
    }
}