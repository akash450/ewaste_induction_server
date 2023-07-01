import DataUriParser from "datauri/parser.js";
import path from "path";
import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'akash1305.ai@gmail.com',
        pass: 'xetxcqjdeqpesffq'
    }
});

export const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};

export const sendEmail = async (to, subject, message) => {
    try {
        // Define the email options
        const mailOptions = {
          from: 'akash1305.ai@gmail.com', // Your email address
          to: to,
          subject: subject,
          text: message
        };
    
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } 
    catch (error) {
        console.error('Error sending email:', error.response);
    }   
}