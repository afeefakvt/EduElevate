
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    
    service:'gmail',
    port:587,
    secure:false,
    auth:{
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_PASS
    }

})

export const sendOtptoEmail = async (email:string):Promise<string> =>{    
    const otp = generateOtp()    

    const mailOptions = {
        from:process.env.GMAIL_USER,
        to:email,
        subject:"Your OTP for Account Verification",
        text: `Your OTP for signing into EduElevate is: ${otp}. It is valid for 1 minute only`
    }
    await transporter.sendMail(mailOptions)

    return otp;
}

const generateOtp= () : string => {
    
    const otp = Math.floor(100000  + Math.random()* 900000).toString()
    return otp

}

const otpStore: Record<string, {otp:string; expiresAt:number}> = {};

export const validateOtp = async(email:string,otp:string):Promise<boolean> =>{
    const storedOtp = otpStore[email]

    if(!storedOtp){
        return false
    }
    
    const isExpired = Date.now()>storedOtp.expiresAt

    if(isExpired){
        delete otpStore[email]  // Cleanup expired OTP
        return false
    }
    if(storedOtp.otp===otp){
        delete otpStore[email] // Cleanup used OTP
        
        return true
    }
    return false
}


export const storeOtp = (email:string,otp:string)=>{
    otpStore[email] = {
        otp,
        expiresAt: Date.now()+ 1 * 60 * 1000
    }
    
}

