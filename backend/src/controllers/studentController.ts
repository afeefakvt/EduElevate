import { StudentRepository } from "../repositories/studentRepository";
import { Request,Response } from "express";
import { StudentService } from "../services/studentService";
import { storeOtp,sendOtptoEmail } from "../utils/otp";
import { generateToken } from "../utils/jwt";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";





export class StudentController  {
    
    constructor(
        private studentService: IStudentService,
        private studentRepository: IStudentRepository
    ) {}

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
            

            const student = await this.studentService.createStudent({name,email,password} as any)
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
            const isOtpValid = await this.studentService.verifyOtp(email,otp)

            if(isOtpValid){
                const student = await this.studentRepository.findStudentByEmail(email);
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
            const {token,student} = await this.studentService.loginStudent(email,password)

            if(!token){
                res.status(404).json({message:'student not found'})
                return
              
            }
            
            if(student.role=='admin'){
                res.status(404).json({message:'Cant login email id is already used  for admin '})
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
    // async logoutStudent = (req:Request,res:Response)=>{
    //     try {
    //         res.clearCookie('token')
    //         res.status(200).json({ message: "Logout Successful" });
            
    //     } catch (error) {
    //         res.status(500).json({ message: "Error in logging out", error });
            
    //     }
    // }


    async adminLogin(req:Request,res:Response):Promise<void>{
        try {
            const {email,password} = req.body
            const {token,student} = await this.studentService.loginStudent(email,password)
            if(!token){
                res.status(404).json({message:"Admin not found"})
                return;

            }
            if(student.role !=='admin'){
                throw new Error('Access denied,only admin can login')
            }
            res.status(200).json({message:"Login successful",token,student})
            return;
        } catch (error:any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });
            
        }
    }
}