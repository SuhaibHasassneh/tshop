import nodemailer from 'nodemailer'

export async function sendEmail(to,subject,html){

    const transporter = nodemailer.createTransport({
        service: 'gmail' ,
         auth: {
           user: process.env.SENDER_EMAIL,
           pass: process.env.SENDER_PASSWORD,
         },
       });



       const info = await transporter.sendMail({
        from: `"T-shop 👻" ${process.env.SENDER_EMAIL}`, // sender address
        to, // list of receivers
        subject,
        html,
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
       
}

