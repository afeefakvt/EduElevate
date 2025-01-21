import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service:'gmail',
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
        text: `Your OTP is: ${otp}. It is valid for 10 minutes only`
    }
    await transport.sendMail(mailOptions)

    return otp;
}

const generateOtp= () : string => {
    const otp = Math.floor(100000  + Math.random()* 900000).toString()
    return otp

}

let otpStore: Record<string, {otp:string; expiresAt:number}> = {};

export const validateOtp = async(studentId:string,otp:string):Promise<boolean> =>{
    const storedOtp = otpStore[studentId]

    if(!storedOtp){
        return false
    }
    const isExpired = Date.now()>storedOtp.expiresAt

    if(isExpired){
        delete otpStore[studentId]
        return false
    }
    if(storedOtp.otp===otp){
        delete otpStore[studentId]
        return true
    }
    return false
}


export const storeOtp = (studentId:string,otp:string)=>{
    otpStore[studentId] = {
        otp,
        expiresAt: Date.now()+10 * 60 * 1000
    }
}