import { Request, Response } from "express";
import { ITutorService } from "../interfaces/tutor/ITutorService";
import { sendOtptoEmail, storeOtp } from "../utils/otp";
import { generateToken } from "../utils/jwt";
import { verifyPasswordResetToken } from "../utils/jwt";
import { HTTP_STATUS } from "../constants/httpStatusCode";
import { verifyRefreshToken } from "../utils/jwt";
import Tutor from "../models/tutorModel";
import { RequestWithUser } from "../middlewares/authToken";
import { MESSAGES } from "../constants/message";


export class TutorController {

    constructor(
        private tutorService: ITutorService,
    ) {}

    async registerTutor(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password,confirmPassword, title, bio } = req.body
            if (password !== confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.PASSWORD_MISMATCH })
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

                res.status(HTTP_STATUS.OK).json({ tutor, message: MESSAGES.OTP_VERIFIED })
                return;
            }
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.INVALID_OTP })
            return;

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: MESSAGES.INTERNAL_SERVER_ERROR })
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

    async loginTutor(req: Request, res: Response): Promise<void> {

        try {
            const { email, password } = req.body
            const { token, refreshToken,tutor } = await this.tutorService.loginTutor(email, password)
            if (!token) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.TUTOR_NOT_FOUND })
                return;
            }

            
            res.cookie("tutorRefreshToken",refreshToken,{
                httpOnly:true,// Prevents JavaScript access (mitigates XSS attacks)
                secure:process.env.NODE_ENV==="production",
                sameSite:"strict", //helps prevent csrf
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

            })
           
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGIN_SUCCESS, token, tutor })
            return;

        } catch (error: any) {  
            console.error("Login Error:", error.message);
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
            return;
        }
    }

    
    
        async refreshAccessToken (req:Request,res:Response):Promise<void>{
            try {
                const refreshToken = req.cookies.tutorRefreshToken;
                console.log(refreshToken,"refreshhhh");
                if(!refreshToken){
                    console.error("No refresh token found,Logging out.")
            
                res.clearCookie("tutorRefreshToken");
                res.status(HTTP_STATUS.UNAUTHORIZED).json({message:MESSAGES.NO_REFRESH_TOKEN});
                return;
                }
    
    
                const decoded= verifyRefreshToken(refreshToken) as {id:string}
                console.log(decoded,"decoded")
                const tutor = await Tutor.findById(decoded.id)
                console.log("tutor is",tutor)
    
                if(!tutor){
                    res.clearCookie('tutorRefreshToken');
                    res.status(HTTP_STATUS.NOT_FOUND).json({message:MESSAGES.TUTOR_NOT_FOUND})
                    return;
                }
    
                console.log("generating new access token");
                const newAccessToken = generateToken({
                    id:tutor._id,
                    email:tutor.email,
                    role:tutor.role,
                    isBlocked:tutor.isBlocked
                })
                console.log("generated new access token",newAccessToken);
                res.json({token:newAccessToken})
                
                
            } catch (error) {
                console.log("invalid or expired refresh token:",error);
                res.clearCookie("refreshToken");
                res.status(HTTP_STATUS.FORBIDDEN).json({message:MESSAGES.INVALID_REFRESH_TOKEN});
                
            }
        }

    async logoutTutor(req:Request,res:Response):Promise<void>{
        try {    
            // console.log("Cookies received:", req.cookies);

            res.clearCookie('token')
            res.clearCookie("tutorRefreshToken",{
                httpOnly:true,
                secure:process.env.NODE_ENV ==="development"
            })
            res.status(HTTP_STATUS.OK).json({ message: MESSAGES.LOGOUT_SUCCESS });

        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error in logging out", error });

        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            // console.log("Received request for forgot password:", email);

            const resetToken = await this.tutorService.handleForgotPassword(email)
            if (!resetToken) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.TUTOR_NOT_FOUND })
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
            // console.log("Received Token:", req.body.token);


            const decoded = verifyPasswordResetToken(token)
            if (!decoded) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid or expired token" })
                return;
            }
            if (newPassword !== confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({ error: MESSAGES.PASSWORD_MISMATCH });
                return;
            }

            const student = await this.tutorService.updatePassword(decoded.studentId, newPassword);

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

    async getTutorCourses(req:RequestWithUser,res:Response):Promise<void>{
        try {
            
            // const {tutor} = req as AuthenticatedRequest;
            // console.log(req.url);
            const {search="", category="all",sort="default",page=1,limit=4} = req.query
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (!req.tutor || !req.tutor._id) {
                res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied. Not a tutor." });
                return;
              }
            const tutorId = req.tutor._id.toString()            
            const {courses,total} = await this.tutorService.getTutorCourses(tutorId,search as string,category as string,sort as string,pageNumber,limitNumber);
            if(!courses){
                res.status(HTTP_STATUS.NOT_FOUND).json({message:"No courses created"})
            }
            res.status(HTTP_STATUS.OK).json({courses,total})
            
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR});
            (error as Error).message
            
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
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR});
            (error as Error).message
            
        }
    }

    async approvedCount(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params;
            const approvedCount = await this.tutorService.getApprovedCount(tutorId);
            // console.log(approvedCount,"countt");
            res.status(HTTP_STATUS.OK).json(approvedCount) 
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR})    
        }
    }
    async pendingCount(req:Request,res:Response):Promise<void>{
        try {
            const {tutorId} = req.params;
            const pendingCount = await this.tutorService.getPendingCount(tutorId);
            // console.log(approvedCount,"countt");
            res.status(HTTP_STATUS.OK).json(pendingCount) 
        } catch (error) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR})    
        }
    }

    async editTutorProfile(req:Request,res:Response):Promise<void>{
        try {
            const {name,title,bio} = req.body;
            const {tutorId} = req.params;

            const result = await this.tutorService.editTutorProfile(tutorId,{name,title,bio})
            
            if (!result) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.TUTOR_NOT_FOUND });
                return;
              }
              res.status(HTTP_STATUS.CREATED).json({message:MESSAGES.EDIT_PROFILE_SUCCESS,result})
            
        } catch (error) {
            console.error("error editing profile",error)
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:MESSAGES.INTERNAL_SERVER_ERROR})
            
            
        }
    }
    async changeTutorPassword (req:RequestWithUser,res:Response):Promise<void>{
        try {
            const {tutorId} =req.params;
            const {currentPassword,newPassword} = req.body;
            await this.tutorService.changeTutorPassword(tutorId,currentPassword,newPassword)
            res.status(200).json({message:"Password updates successfully. Please login again"})

        } catch (error:any) {            
            res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message || 'Something went wrong' })
        }
    }

   

}