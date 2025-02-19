import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request,Response } from 'express'
import { Error } from 'mongoose'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "my_refresh_secret_key"


if(!JWT_SECRET){
    throw new Error("JWT is not defined in the .env")
}
if(!JWT_REFRESH_SECRET){
    throw new Error("JWT refresh is not defined in the .env")
}

export const generateToken = (payload:object): string =>{
    return jwt.sign(payload, JWT_SECRET,{expiresIn:'30m'})
}
export const generateRefreshToken = (payload:object):string=>{
    return jwt.sign(payload,JWT_REFRESH_SECRET,{expiresIn:"7d"})
}

export const verifyToken = (token:string)=>{
    try {
        return jwt.verify(token,JWT_SECRET)
    } catch (error) {
        throw new Error('invalid token')
        
    }
} 

export const verifyRefreshToken = (token:string)=>{
    try {
        return jwt.verify(token,JWT_REFRESH_SECRET)
    } catch (error) {
        throw new Error('invalid token')
        
    }
}

export const generatePasswordResetToken = (studentId:string):string=>{
    return jwt.sign({studentId},JWT_SECRET,{expiresIn:"15m"})
}
export const verifyPasswordResetToken = (token:string):any=>{
    try {
        // console.log("Received Token:", token);

        return jwt.verify(token,JWT_SECRET)
    } catch (error) {
        throw new Error('invalid token')
        
    }
}









// export const generateResetToken = (userId:string):string=>{
//     return jwt.sign({userId}, JWT_SECRET, {expiresIn:'15m'})
// }
// export const verifyResetToken = (token:string):any=>{
//     try {
//         return jwt.verify(token,JWT_SECRET)
//     } catch (error) {
//         throw new Error('invalid token')
        
//     }
// }