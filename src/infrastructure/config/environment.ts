import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
    
    // Email service
    emailService: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },

    // SMS service
    smsService: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
};