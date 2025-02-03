import { StudentRepository } from "../repositories/studentRepository";
import { Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { storeOtp, sendOtptoEmail } from "../utils/otp";
import { generateToken, verifyPasswordResetToken } from "../utils/jwt";
import { IStudentService } from "../interfaces/student/IStudentService";
import { IStudentRepository } from "../interfaces/student/IStudentRepository";
import { OAuth2Client } from "google-auth-library";
import { Student } from "../models/studentModel";



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)


export class StudentController {

    constructor(
        private studentService: IStudentService,
        private studentRepository: IStudentRepository
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
                const student = await this.studentRepository.findStudentByEmail(email);
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
            const { token, student } = await this.studentService.loginStudent(email, password)

            if (!token) {
                res.status(404).json({ message: 'student not found' })
                return;
            }

            if (student.role == 'admin') {
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
            const { token, student } = await this.studentService.loginStudent(email, password)
            if (!token) {
                res.status(404).json({ message: "Admin not found" })
                return;

            }
            if (student.role !== 'admin') {
                throw new Error('Access denied,only admin can login')
            }
            res.status(200).json({ message: "Login successful", token, student })
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

            const token = generateToken({ id: student._id, email: student.email, role: student.role })
            res.status(200).json({ message: "google sign in success", token, student })

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
}