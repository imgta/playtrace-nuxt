export default function (brevoAPI: any) {
    async function inviteEmail(toEmail: string, toName: string) {
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
                    email: '200okteam@gmail.com',
                },
                to: [{ email: toEmail, name: toName }],
                replyTo: {
                    email: '200okteam@gmail.com',
                    name: 'playTrace',
                },
                subject: 'playTrace: An invitation awaits',
                textContent: `Hello ${toName} you have been invited!`,
            }),
        });

        if (!response.ok) {
            return 'Message could not be sent at this time.';
        }
        console.log(response);
    }

    return { inviteEmail };
}
