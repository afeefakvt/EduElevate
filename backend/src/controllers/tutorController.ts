import { Request, Response } from "express";
import { ITutorService } from "../interfaces/tutor/ITutorService";
import { sendOtptoEmail, storeOtp } from "../utils/otp";
import { TutorRepository } from "../repositories/tutorRepository";
import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import {sendEmail} from "../utils/mail"
import { generateToken } from "../utils/jwt";
import { OAuth2Client } from "google-auth-library";
import { title } from "process";




const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export class TutorController {
    
        constructor (
            private tutorService:ITutorService,
            private tutorRepository:ITutorRepository
        ){}

        async registerTutor(req:Request,res:Response):Promise<void>{
            try {
                const {name,email,password,title,bio} = req.body

                const otp = await sendOtptoEmail(email)
        
                storeOtp(email,otp)
             
                const tutor  = await this.tutorService.registerTutor({name,email,password,title,bio} as any)
                res.status(201).json({message:"tutor created,otp is send to your email address"})
                
            } catch (error) {
                res.status(500).json({success:false,message:'error registering tutor', error: error instanceof Error ? error.message : error,})
                
            }

        }
        async verifyOtp(req:Request,res:Response):Promise<void>{
            try {
                const {email,otp} = req.body
                const isValidOtp = await this.tutorService.verifyOtp(email,otp)

                if(isValidOtp){
                    const tutor = await this.tutorRepository.findTutorByEmail(email)
                    if(tutor){
                        tutor.isApproved= false
                        tutor.status = "pending"
                        await tutor.save()
                    }
                
                     res.status(200).json({tutor,message:'otp verified successfully'})
                     return;
                }
                 res.status(400).json({message:'invalid otp'})
                 return;

            } catch (error) {
                res.status(500).json({success:false,message:'internal server error'})  
            }
        }

        async resendOtp(req:Request,res:Response):Promise<void>{
            try {
                const {email} = req.body
                
                const otp = await sendOtptoEmail(email)
                storeOtp(email,otp)
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to resend OTP.',
                    error: error instanceof Error ? error.message : error,
                });
                
            }
        }

      async loginTutor(req:Request,res:Response):Promise<void>{

        try {
            const {email,password} = req.body
            const {token,tutor} = await this.tutorService.loginTutor(email,password)
            if(!token){
                res.status(404).json({message:"tutor not found"})
                return;
            }
            if(tutor.isBlocked){
                res.status(403).json({ message: 'Your account is blocked ' });
                return
               
            }
            console.log("genretaeeee");
    
            res.status(200).json({message:'Login successful',token,tutor})
            return;
            
            
        } catch (error:any) {
            console.error("Login Error:", error.message);

         res.status(400).json({ success: false, message: error.message });
         return;
            
        }
      
      }
    
}