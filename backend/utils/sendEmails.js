const nodeMailer = require('nodemailer');


const sendEmail = async(to, subject, text) =>{
    try{
        const transport = nodemailer.createTransport({
            service : 'Gmail',
            auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from : process.env.EMAIL_USER,
            to,
            subject, 
            text
        }
        await transport.sendMail(mailOptions);
    }
    catch(error){
        console.error('Error sending Email :', error);
        
    }
};

module.exports = sendEmail;