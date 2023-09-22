export default function (brevoAPI: any) {
    async function inviteEmail(fromEmail: string, toEmail: string, toName: string, message: string) {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'api-key': `${brevoAPI}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: 'playTrace',
                    email: fromEmail,
                },
                to: [{ email: toEmail, name: toName }],
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
        console.log(response);
    }

    return { inviteEmail };
}
