import { Request, Response } from "express";
import { storeOtp, sendOtptoEmail } from "../utils/otp";
import { generateToken, verifyPasswordResetToken } from "../utils/jwt";
import { IStudentService } from "../interfaces/student/IStudentService";
import { OAuth2Client } from "google-auth-library";
import { Student } from "../models/studentModel";
import mongoose, { mongo } from "mongoose";
import Stripe from "stripe";




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
                res.status(400).json({ message: "passwords do not match" })
                return;
            }

            const otp = await sendOtptoEmail(email)
            storeOtp(email, otp)
            console.log('otp is', otp);


            const student = await this.studentService.createStudent({ name, email, password } as any)

            res.status(201).json({ message: 'student created successfully, otp is send to the email address' })
        } catch (error: any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });

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
                res.status(200).json({ student, message: 'otp verified successfully' })
                return;
            }
            res.status(400).json({ message: 'invalid otp' })
            return;

        } catch (error: any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });
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
            res.status(500).json({
                success: false,
                message: 'Failed to resend OTP.',
                error: error instanceof Error ? error.message : error,
            });

        }
    }
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            const { token, student ,role} = await this.studentService.loginStudent(email, password)

            if (!token) {
                res.status(404).json({ message: 'student not found' })
                return;
            }

            if (role == 'admin') {
                res.status(404).json({ message: 'Cant login email id is already used  for admin ' })
                return;

            }
            if (student.isBlocked) {
                res.status(403).json({ message: 'Your account is blocked ' });
                return;

            }
            // console.log("genretaeeee");

            res.status(200).json({ message: 'Login successful', token, student })
            return;

        } catch (error: any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });
            return;

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


    async adminLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body
            // console.log("uyjhncs");
            
            const { token, student,role } = await this.studentService.loginStudent(email, password)
            if (!token) {
                res.status(404).json({ message: "Admin not found" })
                return;

            }
            if (role !== 'admin') {
                throw new Error('Access denied,only admin can login')
            }
            res.status(200).json({ message: "Login successful", token, student,role })
            return;
        } catch (error: any) {
            const message = error.message || 'Internal server error';
            res.status(400).json({ message });

        }
    }

    async googleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { idToken } = req.body
            if (!idToken) {
                res.status(400).json({ error: "google id token is required" })
                return;
            }

            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload()
            if (!payload) {
                res.status(400).json({ error: 'invalid google id token' });
                return;
            }

            const { email, name } = payload
            if (!email) {
                res.status(400).json({ error: 'google account must have an email' });
                return;
            }

            let student = await this.studentService.findStudentByEmail(email)
            if (!student) {
                const studentData = {
                    name,
                    email,
                    password: "",
                    role: "student"
                }
                student = await this.studentService.createStudent(studentData)
            }
            const role = student.role

            const token = generateToken({ id: student._id, email: student.email, role: student.role })
            res.status(200).json({ message: "google sign in success", token, student,role })

        } catch (error) {
            console.error("Error in Google Sign-In:", error);
            res.status(500).json({ error: (error as Error).message });

        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            const resetToken = await this.studentService.handleForgotPassword(email)
            if (!resetToken) {
                res.status(404).json({ message: "no student found" })
                return;
            }
            res.status(200).json({ message: "Password reset link send to registered email" })
        } catch (error) {
            res.status(500).json({ message: "Error in sending link", error });
        }
    }
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, newPassword, confirmPassword } = req.body
            console.log("Received Token:", req.body.token);


            const decoded = verifyPasswordResetToken(token)
            if (!decoded) {
                res.status(400).json({ message: "Invalid or expired token" })
                return;
            }
            if (newPassword !== confirmPassword) {
                res.status(400).json({ error: "Password does not match" });
                return;
            }

            const student = await this.studentService.updatePassword(decoded.studentId, newPassword);

            if (!student) {
                res.status(404).json({ message: "Student not found" })
                return;
            }
            res.status(200).json({ message: "Passoword reset succcessful" })
        } catch (error) {
            console.error("Error resetting password:", error);
            res.status(500).json({ message: "Error resetting password", error });

        }
    }

    async stripePayment (req:Request,res:Response):Promise<void>{
        try {

            console.log("stripeeeeeeeeeee")
            const {courseId} = req.params;
            const studentId = (req as any).student?._id.toString();
            const title = req.body.title
            const price = req.body.price

            if(!mongoose.Types.ObjectId.isValid(courseId)){
                res.status(400).json({message:"Invalid course ID"})
                return;
            }
            const course = await this.studentService.getCourseById(courseId)
            if(!course){
                res.status(404).json({message:"Course not found"})
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
                success_url: `${process.env.FRONTEND_URL}/courses/${courseId}?success=true`,
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
            res.status(500).json({message: "Payment setup failed", error: (error as Error).message,
        });

            
        }

    }
    
}