import { StudentRepository } from "../repositories/studentRepository";
import { Request,Response } from "express";
import { StudentService } from "../services/studentService";
import { storeOtp,sendOtptoEmail } from "../utils/otp";
import { generateToken,verifyResetToken } from "../utils/jwt";


const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);


export class StudentController  {
    async createStudent(req:Request,reS:Response):Promise<void>{
        try {
            const {name,email,mobile,password,confirmPassword} = req.body

            if(password!== confirmPassword){
                reS.status(400).json({error:"passwords do not match"})
                return;
            }

            const otp = await sendOtptoEmail(email)
            storeOtp(email,otp)
            console.log('otp is',otp);
            

            const student = await studentService.createStudent({name,email,mobile,password} as any)
            reS.status(201).json({message:'student created successfully, otp is send to the email address'})
        } catch (error:any) {
            reS.status(400).json({error:error.message})
            
        }
    }


    async verifyOtp (req:Request,res:Response): Promise<void>{
        try {
            const {email,otp} = req.body
            const isOtpValid = await studentService.verifyOtp(email,otp)

            if(isOtpValid){
                const student = await studentRepository.findStudentByEmail(email);
                if(student){
                    await student.save()
                }
                res.status(200).json({student,message:'otp verified successfully'})
            }
            res.status(400).json({message:'invalid otp'})
            
        } catch (error) {
            res.status(500).json({message:'server error'})
            
        }

    }
    async login(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} = req.body
            const {token,student} = await studentService.loginStudent(email,password)

            if(!token){
                res.status(404).json({message:'student not found'})
                return
            }
            if(student.isBlocked){
                throw new Error('Your account is blcoked by admin')
            }
            res.status(200).json({message:'Login successful',token,student})

            return;
        } catch (error) {
            res.status(500).json({message:'server error'})
            return;
            
        }
    }
}