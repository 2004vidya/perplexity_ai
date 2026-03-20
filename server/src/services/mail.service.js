import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

export async function sendEmail({ to, subject, text }) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        text
    }
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully", details.response);
}

