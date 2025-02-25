import { RequestWithUser } from "./authToken";
import { Response,NextFunction } from "express";

export const authorizeRoles = (roles:string[])=>{
    return (req:RequestWithUser,res:Response,next:NextFunction)=>{
        if(!req.user || !roles.includes(req.user.role)){
            res.status(403).json({message:"Access denied. Insufficient permissions."})
            return;
        }
        next();
    };

};