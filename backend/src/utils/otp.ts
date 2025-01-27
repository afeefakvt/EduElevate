import { log } from 'console';
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
    console.log("awgdvghsb");
    
    const otp = generateOtp()
    console.log("otpppp vannu");
    

    const mailOptions = {
        from:process.env.GMAIL_USER,
        to:email,
        subject:"Your OTP for Account Verification",
        text: `Your OTP for signing into EduElevate is: ${otp}. It is valid for 1 minute only`
    }
    await transporter.sendMail(mailOptions)

    console.log("otpppppppppppppp");
    

    return otp;
}

const generateOtp= () : string => {
    console.log("afefggb");
    
    const otp = Math.floor(100000  + Math.random()* 900000).toString()
    return otp

}

let otpStore: Record<string, {otp:string; expiresAt:number}> = {};

export const validateOtp = async(email:string,otp:string):Promise<boolean> =>{
    const storedOtp = otpStore[email]

    if(!storedOtp){
        console.log('falseee');
        return false
        
        
    }
    const isExpired = Date.now()>storedOtp.expiresAt

    if(isExpired){
        delete otpStore[email]  // Cleanup expired OTP
        console.log('expiredd');
        
        return false
    }
    if(storedOtp.otp===otp){
        delete otpStore[email] // Cleanup used OTP
        console.log('trueee');
        
        return true
    }
    console.log("Invalid OTP for email:", email);
    return false
}


export const storeOtp = (email:string,otp:string)=>{
    otpStore[email] = {
        otp,
        expiresAt: Date.now()+ 1 * 60 * 1000
    }
    console.log('storeddd otp');
    
}

