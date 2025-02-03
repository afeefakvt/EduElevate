import { verifyToken } from "../utils/jwt";
import { Request,Response,NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import Tutor from "../models/tutorModel";

interface DecodedToken extends JwtPayload{
    id:string
}
export const authenticateToken = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const token = req.cookies.tutorAuthToken

    if(!token){
        res.status(401).json({message:'token not found'})
        return;
    }
    try {
        const decoded  = verifyToken(token) as DecodedToken
        // console.log("12233w223qwdwads",decoded);
        const tutor  = await Tutor.findById(decoded.id)
        
        if(!tutor){
            res.status(404).json({message:'User not found'})
            return;
        }

        if(tutor.isBlocked){
            res.status(403).json({message:'Your account is blocked'})
            return; 
        }

        (req as any).tutor = tutor;
        next()
    } catch (error) {
        res.status(403).json({message:'invalid token'})
        return;
        
    }
}