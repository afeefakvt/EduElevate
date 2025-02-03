import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request,Response } from 'express'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'my_secret_key'

export const generateToken = (payload:object): string =>{
    return jwt.sign(payload, JWT_SECRET,{expiresIn:'1h'})
}

export const verifyToken = (token:string)=>{
    try {
        return jwt.verify(token,JWT_SECRET)
    } catch (error) {
        throw new Error('invalid token')
        
    }
} 

export const generatePasswordResetToken = (studentId:string):string=>{
    return jwt.sign({studentId},JWT_SECRET,{expiresIn:"15m"})
}
export const verifyPasswordResetToken = (token:string):any=>{
    try {
        console.log("Received Token:", token);

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