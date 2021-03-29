// basic imports
var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
var validator = require("email-validator");
const dotenv = require('dotenv');
dotenv.config();

// create nodemailer transport to send emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thomasyarnellphotos@gmail.com",
      pass: process.env.PASSWORD
    }
});

// check for phone number complexity w/ regex
const phoneNumRegex = (text) => {
  var reqs = /^[0-9]{10,11}$/;
  var replaced = text.toString().replace(/-/g, "").replace(/[()]/g, "").replace(/\s/g, "")
  if(replaced.match(reqs)){
    return true;
  }
  else{
    return false;
  }
}
  
// check for name validation w/ regex
const nameRegex = (text) => {
  var reqs = /^[ a-zA-Z\-’]+$/;
  if(text.match(reqs)){
    return true;
  }
  else{
    return false;
  }
}

// post /contact
// takes fname, lname, email, phone, subject, message as prerequisites
router.post('/contact', (req, res, next) => {
    // grab user input
    const { first_name, last_name, email, phone, subject, message } = req.body;

    // convert phone_num into various formats
    var stringPhone_num = phone.toString().replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(" ", "");
    if(stringPhone_num.length === 10){
        var temp = "(" + stringPhone_num.slice(0, 3) + ")-" + stringPhone_num.slice(3, 6) + "-" + stringPhone_num.slice(6, 10);
        stringPhone_num = temp;
    }
    else if(stringPhone_num.length === 11){
        var temp = stringPhone_num.slice(0, 1) + " (" + stringPhone_num.slice(1, 4) + ")-" + stringPhone_num.slice(4, 7) + "-" + stringPhone_num.slice(7, 11);
        stringPhone_num = temp;
    }

    // check email format
    if (!validator.validate(email)) {
        // req.flash('error', 'Email Format not Valid')
        res.sendStatus(400)
    }
    // check phone number validation
    else if(!phoneNumRegex(phone)){
        // req.flash('error', 'Phone Number not accepted, please enter a valid Phone Number')
        res.sendStatus(400);
    }
    // check first name validation
    else if(!nameRegex(first_name)){
        // req.flash('error', 'First Name not valid, please enter a valid First Name')
        res.sendStatus(400);
    }
    // check last name validation
    else if(!nameRegex(last_name)){
        // req.flash('error', 'Last Name not valid, please enter a valid Last Name')
        res.sendStatus(400);
    }
    else{
        // send email
        // const output = `
        // <p>Thomas Yarnell Photography Contact Request</p>
        // <h3>Contact Details</h3>
        // <ul>  
        //     <li>Name: ${first_name}  ${last_name}</li>
        //     <li>Email: ${email}</li>
        //     <li>Phone: ${stringPhone_num}</li>
        // </ul>
        // <h3>Subject</h3>
        // <p>Subject: ${subject}</p>
        // <h3>Message</h3>
        // <p>${message}</p>
        // `;

        const output3 = `
        <h3>Your message to Thomas Yarnell Photography: thomasyarnellphotos@gmail.com</h3>
        <h3>Contact Details</h3>
        <ul>  
            <li>Name: ${first_name}  ${last_name}</li>
            <li>Email: ${email}</li>
            <li>Phone: ${stringPhone_num}</li>
        </ul>
        <h3>Subject</h3>
        <p>Subject: ${subject}</p>
        <h3>Message</h3>
        <p>${message}</p>
        `;

        const output = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Demystifying Email Design</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <style type="text/css">
                a[x-apple-data-detectors] {color: inherit !important;}
            @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&family=Source+Sans+Pro:wght@600&display=swap');
            </style>
        </head>
        <body style="margin: 0; padding: 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 20px 0 30px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-radius: 8px">
            <tr>
                <td align="center" bgcolor="#e8980d" style="padding: 40px 0 30px 0;">
                    <img src="https://cdn.discordapp.com/attachments/762549545749839943/816206682060750888/logo_1.png">
                </td>
            </tr>
            <tr>
                <td bgcolor="#f0f0f0" style="padding: 40px 30px 40px 30px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                        <tr>
                            <td style="color: #153643; font-family: Josefin Sans, sans-serif;">
                                <h1 style="font-size: 24px; margin: 0;">Contacting Thomas </h1>
                            </td>
                        </tr>
                <tr>
                            <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                        <p style="margin: 0;">Hi ${first_name},<br></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                        <p style="margin: 0;">Thank you for contacting <a style="color: inherit" href="https://thomasyarnell.com">Thomas Yarnell Photography</a>. Mr. Yarnell will get back to you as soon as possible. Here is a copy of your message:</p>
                            </td>
                        </tr>
                <tr>
                  <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
                    <ul style="list-style-type: none; line-height: 28px;">  
                        <li><strong>Name</strong>: ${first_name}  ${last_name}</li>
                        <li><strong>Email</strong>: ${email}</li>
                        <li><strong>Phone</strong>: ${stringPhone_num}</li>
                    </ul>
                  </td>
                </tr>
                      <tr>
                  <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
                    <p style="margin: 0;"><strong>Subject</strong><br><br>${subject}<br><br></p>
                    <p style="margin: 0;"><strong>Message</strong><br><br>${message}</p>
                  </td>
                </tr>
                    </table>
                </td>
            </tr>
        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const options = {
            from: "thomasyarnellphotos@gmail.com",
            to: "thomasyarnellphotos@gmail.com",
            subject: "Thomas Yarnell Photography: " + subject,
            html: output
        };

        const options2 = {
          from: "thomasyarnellphotos@gmail.com",
          to: email,
          subject: "Your message to Thomas Yarnell Photography: " + subject,
          html: output3
        }
          
        transporter.sendMail(options, function (err, info) {
          if (err) {
            res.sendStatus(400);
            return;
          }

          transporter.sendMail(options2, function (err, info) {
            if (err) {
              res.sendStatus(400);
              return;
            }
  
            res.sendStatus(200);
          });
        });
    }

});

module.exports = router;