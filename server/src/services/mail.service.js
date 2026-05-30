// Email service disabled - will be re-enabled in future

export async function sendEmail({ to, subject, text }) {
    console.log('Email service is disabled. Message would have been sent to:', to);
    return { success: false, message: 'Email service is currently disabled' };
}

