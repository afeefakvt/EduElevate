import { StudentRepository } from "../repositories/studentRepository";
import { Request,Response } from "express";
import { StudentService } from "../services/studentService";
import { storeOtp,sendOtptoEmail } from "../utils/otp";
import { generateToken,verifyResetToken } from "../utils/jwt";
import { log } from "console";


const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);


export class StudentController  {
    async createStudent(req:Request,res:Response):Promise<void>{
        try {

            console.log("wegsfwj");
            
            const {name,email,password,confirmPassword} = req.body
            console.log("afefcf");
            

            if(password!== confirmPassword){
                res.status(400).json({message:"passwords do not match"})
                return;
            }

            const otp = await sendOtptoEmail(email)
            storeOtp(email,otp)
            console.log('otp is',otp);
            

            const student = await studentService.createStudent({name,email,password} as any)
            console.log("ugduysjhan");
            
            res.status(201).json({message:'student created successfully, otp is send to the email address'})
        } catch (error:any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });
            
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
            
        } catch (error:any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });
            
        }

    }
    async login(req:Request,res:Response):Promise<void>{
        try {
            console.log("loginnnn");
            
            const {email,password} = req.body
            const {token,student} = await studentService.loginStudent(email,password)

            if(!token){
                res.status(404).json({message:'student not found'})
                return
              
            }
            if(student.isBlocked){
                res.status(403).json({ message: 'Your account is blocked ' });
                return
               
            }
            console.log("genretaeeee");
            
            res.status(200).json({message:'Login successful',token,student})
            console.log(token,student);
          
        } catch (error:any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });
            
        }
    }
}