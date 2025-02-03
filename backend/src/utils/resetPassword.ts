import nodemailer from 'nodemailer'

export const sendEmail = async(email:string,resetToken:string)=>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.GMAIL_USER,
            pass:process.env.GMAIL_PASS
        }
    })

    const resetLink = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`

    const mailOptions = {
        from:process.env.GMAIL_USER,
        to:email,
        subject:"Your password reset link for EduElevate",
        text:`Click the link to change your password:${resetLink}. It will expire in 15 minutes`,
    };
    await transporter.sendMail(mailOptions)
}