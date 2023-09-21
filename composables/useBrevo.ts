export default function () {
    const emailCampaign = useState('invite', () => false);
    const result = 'test';
    return {
        result
    };
}

const config = useRuntimeConfig();
async function sendEmail(fromEmail: string, toEmail: string, fullName: string, message: string) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'api-key': `${config.brevoMailAPI}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            sender: {
                name: 'playTrace',
                email: fromEmail,
            },
            to: [{ email: toEmail, name: fullName }],
            replyTo: {
                email: fromEmail,
                name: 'playTrace',
            },
            subject: 'playTrace: An invitation awaits',
            textContent: message,
        }),
    });

    if (!response.ok) {
        return 'Message could not be sent at this time.';
    }
}
