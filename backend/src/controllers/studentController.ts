import { Request, Response } from "express";
import { storeOtp, sendOtptoEmail } from "../utils/otp";
import { generateToken, verifyPasswordResetToken, verifyRefreshToken } from "../utils/jwt";
import { IStudentService } from "../interfaces/student/IStudentService";
import { OAuth2Client } from "google-auth-library";
import { Student } from "../models/studentModel";
import mongoose from "mongoose";
import Stripe from "stripe";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { MESSAGES } from "../constants/message";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
    apiVersion:"2025-01-27.acacia"
})

const refreshTokenMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE ?? "604800000", 10);


export class StudentController {

    constructor(
        private studentService: IStudentService,
    ){}

    async createStudent(req: Request, res: Response): Promise<void> {
        try {

            const { name, email, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.PASSWORD_MISMATCH })
                return;
            }

            const otp = await sendOtptoEmail(email)
            storeOtp(email, otp)
            console.log('otp is', otp);

            const student = await this.studentService.createStudent({ name, email, password } as any)

            res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.STUDENT_CREATED })
        } catch (error: any) {
            const message = error.message || MESSAGES.INTERNAL_SERVER_ERROR;
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message });

        }
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body
            const isOtpValid = await this.studentService.verifyOtp(email, otp)

            if (isOtpValid) {
                const student = await this.studentService.findStudentByEmail(email);
                if (student) {
                    await student.save()
                }
                res.status(HTTP_STATUS.OK).json({ student, message: MESSAGES.OTP_VERIFIED })
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_OTP })
            return;

        } catch (error: any) {
            const message = error.message || MESSAGES.INTERNAL_SERVER_ERROR;
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message });
            return;
        }

    }
    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body

            const otp = await sendOtptoEmail(email)
            storeOtp(email, otp)
            console.log('otp is', otp);

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.OTP_RESEND_FAIL,
                error: error instanceof Error ? error.message : error,
            });

        }
    }
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const { token, refreshToken,student} = await this.studentService.loginStudent(email, password)

            if (!token) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.STUDENT_NOT_FOUND })
                return;
            }

            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,// Prevents JavaScript access (mitigates XSS attacks)
                secure:process.env.NODE_ENV==="development",
                sameSite:"strict", //helps prevent csrf
                maxAge: refreshTokenMaxAge

            })

            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGIN_SUCCESS, token, student })
            return;

        } catch (error: any) {
            const message = error.message || MESSAGES.INTERNAL_SERVER_ERROR;
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
            return;

        }
    }

    async refreshAccessToken (req:Request,res:Response):Promise<void>{
        try {
            
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken){
                console.error("No refresh token found,Logging out.")
        
            res.clearCookie("refreshToken");
            res.status(HTTP_STATUS.UNAUTHORIZED).json({message:MESSAGES.NO_REFRESH_TOKEN});
            return;
            }


            const decoded= verifyRefreshToken(refreshToken) as {id:string}
            console.log(decoded,"decoded")
            const student = await Student.findById(decoded.id)
            if(!student){
                res.clearCookie('refreshToken');
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.STUDENT_NOT_FOUND})
                return;
            }
            const newAccessToken = generateToken({
                id:student._id,
                email:student.email,
                role:student.role,
                isBlocked:student.isBlocked
            })
            res.json({token:newAccessToken})
            
            
        } catch (error) {
            console.log("invalid or expired refresh token:",error);
            res.clearCookie("refreshToken");
            res.status(HTTP_STATUS.FORBIDDEN).json({message:MESSAGES.INVALID_REFRESH_TOKEN});
            
        }
    }


    async logout(req:Request,res:Response):Promise<void>{
        try {   
            res.clearCookie('token')
            res.clearCookie("refreshToken",{
                httpOnly:true,
                secure:process.env.NODE_ENV ==="production"
            })
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGOUT_SUCCESS });

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error in logging out", error });

        }
    }


    async adminLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            
            const { token, refreshToken,student } = await this.studentService.loginAdmin(email, password)
            if (!token) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.ADMIN_NOT_FOUND })
                return;
            }

            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="development",
                sameSite:"strict", 
                maxAge: 7 * 24 * 60 * 60 * 1000, 

            })  
          
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGIN_SUCCESS, token, student })
            return;
        } catch (error: any) {
            const message = error.message || MESSAGES.INTERNAL_SERVER_ERROR;
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message });

        }
    }

    async adminLogout(req:Request,res:Response):Promise<void>{
        try {
            res.clearCookie('token')
            res.clearCookie("refreshToken",{
                httpOnly:true,
                secure:process.env.NODE_ENV ==="production"
            })
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGOUT_SUCCESS });  
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error in logging out", error });
            
        }
    }

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { idToken } = req.body
            if (!idToken) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.GOOGLE_TOKEN_REQUIRED })
                return;
            }

            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload()
            if (!payload) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.INVALID_GOOGLE_TOKEN });
                return;
            }

            const { email, name } = payload
            if (!email) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.EMAIL_REQUIRED });
                return;
            }

            let student = await this.studentService.findStudentByEmail(email)

            if(student && student.isBlocked===true){
                res.status(HTTP_STATUS.FORBIDDEN).json({error:MESSAGES.ACCOUNT_BLOCKED})
                return;
            }
            if (!student) {
                const studentData = {
                    name,
                    email,
                    password: "",
                    role: "student"
                }
                student = await this.studentService.createStudent(studentData)
            }

            const token = generateToken({ id: student._id, email: student.email, role: student.role })
    
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.GOOGLE_SIGNIN_SUCCESS, token, student })

        } catch (error) {
            console.error("Error in Google Sign-In:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });

        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            const resetToken = await this.studentService.handleForgotPassword(email)
            if (!resetToken) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.STUDENT_NOT_FOUND })
                return;
            }
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.PASSWORD_RESET_LINK_SENT })
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASSWORD_RESET_ERROR, error });
        }
    }
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, newPassword, confirmPassword } = req.body
            console.log("Received Token:", req.body.token);


            const decoded = verifyPasswordResetToken(token)
            if (!decoded) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid or expired token" })
                return;
            }
            if (newPassword !== confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.PASSWORD_MISMATCH });
                return;
            }

            const student = await this.studentService.updatePassword(decoded.studentId, newPassword);

            if (!student) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.STUDENT_NOT_FOUND })
                return;
            }
            res.status(HTTP_STATUS.OK).json({ message: "Passoword reset succcessful" })
        } catch (error) {
            console.error("Error resetting password:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error resetting password", error });

        }
    }

    async stripePayment (req:Request,res:Response):Promise<void>{
        try {

            const {courseId} = req.params;
            const studentId = (req as any).student?._id.toString();
            const title = req.body.title
            const price = req.body.price

                        
            if(!mongoose.Types.ObjectId.isValid(courseId)){
                res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Invalid course ID"})
                return;
            }
            const course = await this.studentService.getCourseById(courseId)
            if(!course){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.COURSE_NOT_FOUND})
                return;
            }
            const session = await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                line_items:[
                    {
                        price_data: {
                          currency: "inr",
                          product_data: {
                            name: title,
                            // description: course.description,
                          },
                          unit_amount: Math.round(price * 100),
                        },
                        quantity: 1,
                      },
                ],
                mode: "payment",
                success_url: `${process.env.FRONTEND_URL}/myCourses?success=true`,
                cancel_url: `${process.env.FRONTEND_URL}/courses/${courseId}?cancelled=true`,
                metadata: {
                  courseId: courseId,
                  studentId: studentId.toString(),
                },
            })
            console.log("stripe test success");
            res.json({ id: session.id });

            
        } catch (error) {
            console.error("Stripe payment error:", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message: "Payment setup failed", error: (error as Error).message,
        });  
        }
    }


    async editProfile(req:Request,res:Response):Promise<void>{
        try {
            const {name} = req.body            
            const {studentId} =req.params
            
            const result = await this.studentService.editProfile(studentId,{name})
            if (!result) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.STUDENT_NOT_FOUND });
                return;
              }
            console.log(result)
            res.status(HTTP_STATUS.CREATED).json({message:MESSAGES.EDIT_PROFILE_SUCCESS,result})
        } catch (error) {
            console.error("error editing profile",error)
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR})
            
        }
    }

    async changePassword(req:Request,res:Response):Promise<void>{
        try {
            const {studentId} = req.params;
            const {currentPassword,newPassword} = req.body;
                await this.studentService.changePassword(studentId,currentPassword,newPassword)
                res.status(200).json({message:"Password updates successfully. Please login again"})
          
        } catch (error:any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message || 'Something went wrong' })
            
        }
    }

    async getStudent(req:Request,res:Response):Promise<void>{
        try {
            const {studentId} = req.params
            const student = await this.studentService.getStudentById(studentId)
            res.status(HTTP_STATUS.OK).json(student)

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR})
            
        }
    }
    
}