import { Request, Response } from "express";
import { storeOtp, sendOtptoEmail } from "../utils/otp";
import { generateToken, verifyPasswordResetToken, verifyRefreshToken ,generateRefreshToken} from "../utils/jwt";
import { IStudentService } from "../interfaces/student/IStudentService";
import { OAuth2Client } from "google-auth-library";
import { Student } from "../models/studentModel";
import mongoose, { mongo } from "mongoose";
import Stripe from "stripe";
import { HTTP_STATUS } from "../constants/httpStatusCode";




const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,{
    apiVersion:"2025-01-27.acacia"
})


export class StudentController {

    constructor(
        private studentService: IStudentService,
    ){}

    async createStudent(req: Request, res: Response): Promise<void> {
        try {

            const { name, email, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "passwords do not match" })
                return;
            }

            const otp = await sendOtptoEmail(email)
            storeOtp(email, otp)
            console.log('otp is', otp);


            const student = await this.studentService.createStudent({ name, email, password } as any)

            res.status(HTTP_STATUS.CREATED).json({ message: 'student created successfully, otp is send to the email address' })
        } catch (error: any) {
            const message = error.message || 'Internal server error';
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
                res.status(HTTP_STATUS.OK).json({ student, message: 'otp verified successfully' })
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'invalid otp' })
            return;

        } catch (error: any) {
            const message = error.message || 'Internal server error';
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
                message: 'Failed to resend OTP.',
                error: error instanceof Error ? error.message : error,
            });

        }
    }
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const { token, refreshToken,student} = await this.studentService.loginStudent(email, password)

            if (!token) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'student not found' })
                return;
            }
            // console.log("genretaeeee");

            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,// Prevents JavaScript access (mitigates XSS attacks)
                secure:process.env.NODE_ENV==="development",
                sameSite:"strict", //helps prevent csrf
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

            })

            res.status(HTTP_STATUS.OK).json({ message: 'Login successful', token, student })
            return;

        } catch (error: any) {
            const message = error.message || 'Internal server error';
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message });
            return;

        }
    }


    async refreshAccessToken (req:Request,res:Response):Promise<void>{
        try {

            console.log("refressshhhhhhhhhh");
            
            const refreshToken = req.cookies.refreshToken;
            console.log(refreshToken,"refreshhhh");
            if(!refreshToken){
                console.error("No refresh token found,Logging out.")
        
            res.clearCookie("refreshToken");
            res.status(HTTP_STATUS.UNAUTHORIZED).json({message:"No refresh token found"});
            return;
            }


            const decoded= verifyRefreshToken(refreshToken) as {id:string}
            console.log(decoded,"decoded")
            const student = await Student.findById(decoded.id)
            console.log("student is",student)

            if(!student){
                res.clearCookie('refreshToken');
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"student not found"})
                return;
            }

            console.log("generating new access token");
            const newAccessToken = generateToken({
                id:student._id,
                email:student.email,
                role:student.role,
                isBlocked:student.isBlocked
            })
            console.log("generated new access token",newAccessToken);
            res.json({token:newAccessToken})
            
            
        } catch (error) {
            console.log("invalid or expired refresh token:",error);
            res.clearCookie("refreshToken");
            res.status(HTTP_STATUS.FORBIDDEN).json({message:"Invalid or expired refresh token"});
            
        }
    }


    async logout(req:Request,res:Response):Promise<void>{
        try {    

            // console.log('Headers:', req.headers) // Log incoming headers
            // console.log('Cookies:', req.cookies) 
            // console.log("Cookies received:", req.cookies);
            
            res.clearCookie('token')
            res.clearCookie("refreshToken",{
                httpOnly:true,
                secure:process.env.NODE_ENV ==="production"
            })
            res.status(HTTP_STATUS.OK).json({ message: "Logout Successful" });

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error in logging out", error });

        }
    }


    async adminLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            // console.log("uyjhncs");
            
            const { token, refreshToken,student } = await this.studentService.loginAdmin(email, password)
            if (!token) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Admin not found" })
                return;
            }

            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="development",
                sameSite:"strict", 
                maxAge: 7 * 24 * 60 * 60 * 1000, 

            })  
          
            res.status(HTTP_STATUS.OK).json({ message: "Login successful", token, student })
            return;
        } catch (error: any) {
            const message = error.message || 'Internal server error';
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
            res.status(HTTP_STATUS.OK).json({ message: "Logout Successful" });  
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error in logging out", error });
            
        }
    }

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { idToken } = req.body
            if (!idToken) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "google id token is required" })
                return;
            }

            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload()
            if (!payload) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'invalid google id token' });
                return;
            }

            const { email, name } = payload
            if (!email) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'google account must have an email' });
                return;
            }

            let student = await this.studentService.findStudentByEmail(email)

            if(student && student.isBlocked===true){
                res.status(HTTP_STATUS.FORBIDDEN).json({error:"You are blocked currently,Can't login"})
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
    
            res.status(HTTP_STATUS.OK).json({ message: "google sign in success", token, student })

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
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "no student found" })
                return;
            }
            res.status(HTTP_STATUS.OK).json({ message: "Password reset link send to registered email" })
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error in sending link", error });
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
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Password does not match" });
                return;
            }

            const student = await this.studentService.updatePassword(decoded.studentId, newPassword);

            if (!student) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Student not found" })
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

            console.log("stripeeeeeeeeeee")
            const {courseId} = req.params;
            const studentId = (req as any).student?._id.toString();
            const title = req.body.title
            const price = req.body.price

            console.log(courseId,"coyrseeeeeid");
            console.log(studentId,"studentttttttttt");
                        
            if(!mongoose.Types.ObjectId.isValid(courseId)){
                res.status(HTTP_STATUS.BAD_REQUEST).json({message:"Invalid course ID"})
                return;
            }
            const course = await this.studentService.getCourseById(courseId)
            if(!course){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"Course not found"})
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
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Student not found." });
                return;
              }
            console.log(result)
            res.status(HTTP_STATUS.CREATED).json({message:"editted profile successfully",result})
        } catch (error) {
            console.error("error editing profile",error)
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"internal server error"})
            
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
    
}