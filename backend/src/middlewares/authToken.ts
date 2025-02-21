import { verifyToken } from "../utils/jwt";
import { Request,Response,NextFunction } from "express";
import { IStudent, Student } from "../models/studentModel";
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload{
    id:string
}

interface RequestWithStudent extends Request{
    student:IStudent
}
export const authenticateToken = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    // const token = req.cookies.authToken

    const token  = req.headers.authorization?.split(" ")[1];
    console.log("authenticating the token");

    if(!token){
        res.status(401).json({message:'token not found'})
        return;
    }
    try {
        const decoded  = verifyToken(token) as DecodedToken
        // console.log("12233w223qwdwads",decoded);
        const student  = await Student.findById(decoded.id)
        
        if(!student){
            res.status(404).json({message:'User not found'})
            return;
        }

        if(student.isBlocked){
            res.status(403).json({message:'Your account is blocked'})
            return; 
        }

        (req as RequestWithStudent).student = student;
        next()
    } catch (error) {
        res.status(403).json({message:'Token is expired.Please login again.'})
        return;
        
    }
}