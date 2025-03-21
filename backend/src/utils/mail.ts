import nodemailer from 'nodemailer';

export const sendEmail= async(email: string,subject:string,text:string):Promise<void> => {
    try {
      
        const transporter = nodemailer.createTransport({
            service:'gmail',
            port:587,
            secure:false,
            auth:{
                user:process.env.GMAIL_USER,
                pass:process.env.GMAIL_PASS
            }
        });
  
        const mailOptions = {
            from:process.env.GMAIL_USER,
            to:email,
            subject:subject,
            text: text
        }
      
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email could not be sent");
    }
  }