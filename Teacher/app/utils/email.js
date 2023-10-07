const nodemailer = require('nodemailer');

function sendingEmailService(SenderEmail,receiverEmail,subject,messageText){
 try {
      var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "34e6bc02281a4e",
            pass: "eeaecc712e43d7"
          }
        });
  
      var mailOptions = {
        from:SenderEmail ,
        to: receiverEmail,
        subject:subject ,
        text: messageText
      };
      transport.sendMail(mailOptions, function(error, info){
        if (error) {
            return action={'Error: ' : error};       
         } else {
            return action={'Email sent: ' : info.response};
        }
      });
 } catch (error) {
    return error
 }

}


module.exports={
    sendingEmailService
}