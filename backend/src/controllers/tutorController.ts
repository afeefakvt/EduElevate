import { Request, Response } from "express";
import { ITutorService } from "../interfaces/tutor/ITutorService";
import { sendOtptoEmail, storeOtp } from "../utils/otp";
import { TutorRepository } from "../repositories/tutorRepository";
import { ITutorRepository } from "../interfaces/tutor/ITutorRepository";
import {sendEmail} from "../utils/mail"

export class TutorController {
    
        constructor (
            private tutorService:ITutorService,
            private tutorRepository:ITutorRepository
        ){}

        async registerTutor(req:Request,res:Response):Promise<void>{
            try {
                const {name,email,password,title,bio} = req.body

                const otp = await sendOtptoEmail(email)
                storeOtp(otp,email)

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
                }
                res.status(400).json({message:'invalid otp'})

            } catch (error) {
                res.status(500).json({success:false,message:'internal server error'})  
            }
        }

      async loginTutor(req:Request,res:Response):Promise<void>{
        const {email,password} = req.body
        const tutor = await this.tutorService.loginTutor(email,password)
      }
    
}