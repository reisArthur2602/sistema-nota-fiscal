import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export type SendMailOptions = {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
};

export const sendMail = async ({ to, subject, html, text }: SendMailOptions) => {
    const info = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html,
        text,
    });

    return info;
};
