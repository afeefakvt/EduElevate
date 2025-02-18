import { Request, Response } from "express";
import { ITutorService } from "../interfaces/tutor/ITutorService";
import { sendOtptoEmail, storeOtp } from "../utils/otp";
import { sendEmail } from "../utils/mail"
import { generateToken } from "../utils/jwt";
import { verifyPasswordResetToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../types/types";
import mongoose from "mongoose";
import { CourseService } from "../services/courseService";
import { HTTP_STATUS } from "../constants/httpStatusCode";


export class TutorController {

    constructor(
        private tutorService: ITutorService,
    ) {}

    async registerTutor(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password,confirmPassword, title, bio } = req.body
            if (password !== confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "passwords do not match" })
                return;
            }

            const otp = await sendOtptoEmail(email)

            storeOtp(email, otp)
            console.log('otp is', otp);

            const tutor = await this.tutorService.registerTutor({ name, email, password,confirmPassword, title, bio } as any)
            res.status(HTTP_STATUS.CREATED).json({ message: "tutor created,otp is send to your email address" })

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: 'error registering tutor', error: error instanceof Error ? error.message : error, })

        }

    }
    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, otp } = req.body
            const isValidOtp = await this.tutorService.verifyOtp(email, otp)

            if (isValidOtp) {
                const tutor = await this.tutorService.findTutorByEmail(email)
                if (tutor) {
                    tutor.isApproved = false
                    tutor.status = "pending"
                    await tutor.save()
                }

                res.status(HTTP_STATUS.OK).json({ tutor, message: 'otp verified successfully' })
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'invalid otp' })
            return;

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: 'internal server error' })
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

    async loginTutor(req: Request, res: Response): Promise<void> {

        try {
            const { email, password } = req.body
            const { token, tutor } = await this.tutorService.loginTutor(email, password)
            if (!token) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "tutor not found" })
                return;
            }
            if (tutor.isBlocked) {
                res.status(403).json({ message: 'Your account is blocked ' });
                return;
            }
            res.status(HTTP_STATUS.OK).json({ message: 'Login successful', token, tutor })
            return;

        } catch (error: any) {
            console.error("Login Error:", error.message);

            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
            return;
        }
    }
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            // console.log("Received request for forgot password:", email);

            const resetToken = await this.tutorService.handleForgotPassword(email)
            if (!resetToken) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: "no tutor found" })
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
            // console.log("Received Token:", req.body.token);


            const decoded = verifyPasswordResetToken(token)
            if (!decoded) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid or expired token" })
                return;
            }
            if (newPassword !== confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "Password does not match" });
                return;
            }

            const student = await this.tutorService.updatePassword(decoded.studentId, newPassword);

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

    async getTutorCourses(req:Request,res:Response):Promise<void>{
        try {
            console.log("coursee tutor");
            
            const {tutor} = req as AuthenticatedRequest;
            const tutorId = tutor.id
            const courses = await this.tutorService.getTutorCourses(tutorId);
            if(!courses){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"No courses created"})
            }
            res.status(HTTP_STATUS.OK).json(courses)
            
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"An unexpected error occured"});
            error:(error as Error).message
            
        }
    }

    async getTutorCourseDetails(req:Request,res:Response):Promise<void>{
        try {
            // console.log("jhhvchgvcduvchshjchbn");
            
            const {courseId} = req.params;
            const courseDetails = await this.tutorService.getTutorCourseDetails(courseId);
            // console.log(courseDetails);
            
            res.status(HTTP_STATUS.OK).json(courseDetails)
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"An unexpected error occured"});
            error:(error as Error).message
            
        }
    }

}