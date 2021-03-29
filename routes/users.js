// basic imports
var express = require('express');
var router = express.Router();
const passport = require('passport');
const { encrypt, decrypt, encryptRando, decryptRando } = require('../crypto');
const nodemailer = require('nodemailer');
var validator = require("email-validator");
const ObjectID = require('mongodb').ObjectID;
const atob = require("atob");
// const fetch = require('node-fetch');
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

// check for password complexity w/ regex
const passwordCheckRegex = (text) => {
  var reqs = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; 
  if(text.match(reqs)){
    return true;
  }
  else{
    return false;
  }
};

// console.log(decrypt( { iv: "cb867874b1328d2f341cc5a7391e1eb9", content: "f06c5c5d5766142129330f761c79b1da" }))

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

// ensures users is logged in, or sends a 401 status
const ensureAuthenticated = (req, res, next) => {
  const configdb = req.app.locals.configdb;
  // const now = new Date();
  // var obj = {};
  // obj["date"] = new Date();

  var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log(ip);

  // var requestIp = require('request-ip');
  // app.use(requestIp.mw());

  // app.use(function(req, res) {
  // var ip1 = req.clientIp;
  // console.log(ip1);
    // res.send(ip + '\n');
    // return;
  // });

  var date = new Date();
  console.log("date: " + date);
  var testDate = new Date(date.setTime(date.getTime() - (7 * 60 * 60 * 1000)));
  console.log("date: " + date);
  console.log("testDate: " + testDate);
  console.log(ip)
  console.log(ip.indexOf("47.157.83.143") == -1)
  // if(!ip.indexOf("47.157.87.143") == -1 || !ip.indexOf("2600:6c50:767f:fff5:542b:a801:c9c3:178d") == -1){
    configdb.updateOne({ _id: ObjectID(process.env.CONFIGDB) }, { $push: { logs: testDate.toLocaleString('en-US') + " | " + ip }}).then(() => {}).catch((err) => {
      console.log(err)
      res.sendStatus(400);
    });
  // }
  

  // const fetch = require('node-fetch');
  // fetch('https://api.ipify.org/?format=json').then(results => results.json()).then((data) => {
  //   // obj["ip"] = data.ip;
  //   // var x = data.ip;
  //   // console.log(x);
  //   console.log(obj)
    
  // })
  // .catch((err) => {
  //   console.log(err)
  //   res.sendStatus(400)
  // });
  // console.log(obj)
  


  if (req.isAuthenticated()) {
    return next();
  }

  res.sendStatus(401)
};

// post /login
router.post('/login', passport.authenticate('local', {
  failureFlash: true, 
  
}), (req, res, next) => {
  res.sendStatus(200)

});

// post /login/forgotpasswd
  // takes the user's email as a prerequisite
router.post('/login/forgotpasswd', (req, res, next) => {
  // grab dbs
  const users = req.app.locals.users;
  const email = req.body.email;

  // check email format
  if (!validator.validate(email)) {
    // req.flash('error', 'Email Format not Valid')
    res.sendStatus(400);
  }
  else{
    users
      .findOne( { email: email.toLowerCase() })
      .then(user => {
        // check if email is in db
        if (!user) {
          // req.flash('error', 'Email is not registered')
          res.sendStatus(400);
        }
        else {
          console.log(user)
          console.log(user.password)
          if(user.password === undefined){
            console.log("hihi")
            res.sendStatus(200);
            return;
          }


          // create verification vars
          var rand1 = Math.floor((Math.random() * 100) + 54);
          var host1 = req.get('host');
          var date = new Date();

          // update users doc w/ verification vars
          var obj = {};
          obj["reset"] =  { rand1, host1, date };
          users.updateOne({ _id: ObjectID(user._id) }, { $set: obj })
          .then((doc) => {
            // send email w/ link to reset

            const link1 = "https://thomasyarnell.com/reset?id=" + rand1 + "&o=" + user._id;

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
						<h1 style="font-size: 24px; margin: 0;">Reset Password</h1>
					</td>
				</tr>
        <tr>
					<td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                <p style="margin: 0;">Hi ${user.first_name},<br></p>
					</td>
				</tr>
				<tr>
					<td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                <p style="margin: 0;">You recently requested to reset your password. <br><br>Click the link below (expires in 60 mins) to reset your password: </p>
					</td>
				</tr>
        <tr>
          <td style="color: #153643; font-family: Arial; font-size: 18px; line-height: 24px; padding: 0 0 0 0;">
                <a href="${link1}">Reset Password</a>
					</td>
        </tr>
        <tr>
					<td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 30px 0;">
                <p style="margin: 0;"><br>or paste the following link into your browser: <br>${link1}</p>
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
              to: email,
              subject: "Thomas Yarnell Photography | Reset Password",
              // priority: "high",
              // attachments: [
              //   {
              //     filename: 'email.html',
              //     path: './emai.html'
              //   }
              // ],
              html: output//NoTemplate
            };
            
            transporter.sendMail(options, function (err, info) {
              if (err) {
                res.sendStatus(400);
                return;
              }
            });

            res.sendStatus(200);
          })
          .catch((err) => {
            // req.flash('error', 'Error updating password');
            res.sendStatus(400);
          });
        }
      });

  }

});

// patch /reset
  // user gets here from /login/forgotpasswd email
  // takes the new password as a prerequisite
router.patch('/reset', (req, res, next) => {
  // grab users db 
  const users = req.app.locals.users;

  // find user document
  users.findOne({ _id: ObjectID(req.query.o) })
  .then(doc => {
    // validate that date is within 60 minutes
    var date = new Date(new Date().getTime() - (600000 * 6));
    if(doc.reset.date < date){
      // req.flash('error', '60 minutes has passed, please register again')
      res.sendStatus(408);
      return;
    }

    // check that request is coming from a valid source
    if ((req.protocol + "://" + req.get('host')) === ("https://" + doc.reset.host1) || (req.protocol + "://" + req.get('host')) === ("http://" + doc.reset.host1)) {
      // confirm the random num
      if (req.query.id == doc.reset.rand1) {
        // grab regular stuffs and encrypts
        const users = req.app.locals.users;
        const password = req.body.password;
        const hashedPassword = encrypt(password);

        // check password complexity with regex
        if(!passwordCheckRegex(atob(password))){
          res.sendStatus(400);
        }

        // update user password
        users.updateOne({ _id: ObjectID(req.query.o) }, { $set: {password: hashedPassword.content, iv: hashedPassword.iv }})
        .then(() => {

        })
        .catch((err) => {

          res.sendStatus(400);
        });

        // delete verification vars
        users.updateOne({ _id: ObjectID(req.query.o) }, { $unset: { reset: "" }})
        .then(() => {
          res.sendStatus(200)
        })
        .catch((err) => {
          // req.flash('error', 'Error updating password');
          res.sendStatus(400);
        });

      }
      else{
        // req.flash('error', 'Not verified, please register again')
        res.sendStatus(400);
      }
    }
    else{
      // req.flash('error', 'Request from unknown site')
      res.sendStatus(400);  
    }

  })
  .catch(err => {
    // req.flash('error', 'Cannot find the document')
    res.sendStatus(412);
  });

});

//get /user
  // send user info
router.get('/user', ensureAuthenticated, (req, res, next) => {
  // grab basic stuffs
  const userid  = ObjectID(req.user.id);
  const users = req.app.locals.users;

  // find the user and grab their information
  users.findOne(userid)
  .then(doc => {
    res.send(doc)
    return;
  })
  .catch(err => {
    // error
    res.sendStatus(400)
  })

  

});

// patch /user
  // takes any updated user info params as well as 
  // old and new password at the start if password needs to be changed
router.patch('/user', ensureAuthenticated, (req, res, next) => {
  const users = req.app.locals.users;
  const user_id = ObjectID(req.user.id);
  const { old_email, old_password } = req.body;
  const { first_name, last_name, phone_num, email, } = req.body;
  const { new_password } = req.body;
  console.log(req.body)

  if(old_password !== undefined && decrypt( { iv: req.user.iv, content: req.user.password }) !== old_password){
    // req.flash('error', 'Incorrect password');
    res.sendStatus(401);
    return;
  }

  // check phone number validation
  if(!phoneNumRegex(phone_num) && phone_num !== ''){
      // req.flash('error', 'Phone Number not accepted, please enter a valid Phone Number')
      res.sendStatus(400);
      return;
  }
  // check first name validation
  else if(!nameRegex(first_name)){
      // req.flash('error', 'First Name not valid, please enter a valid First Name')
      res.sendStatus(400);
      return;
  }
  // check last name validation
  else if(!nameRegex(last_name)){
      // req.flash('error', 'Last Name not valid, please enter a valid Last Name')
      res.sendStatus(400);
      return;
  }

  // check email format
  if (!validator.validate(email)) {
      // req.flash('error', 'Email Format not Valid')
      res.sendStatus(400);
      return;
  }
  
  // convert phone_num into various formats
  var stringPhone_num = phone_num.toString().replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(" ", "");
  if(stringPhone_num.length === 10){
      var temp = "(" + stringPhone_num.slice(0, 3) + ")-" + stringPhone_num.slice(3, 6) + "-" + stringPhone_num.slice(6, 10);
      stringPhone_num = temp;
  }
  else if(stringPhone_num.length === 11){
      var temp = stringPhone_num.slice(0, 1) + " (" + stringPhone_num.slice(1, 4) + ")-" + stringPhone_num.slice(4, 7) + "-" + stringPhone_num.slice(7, 11);
      stringPhone_num = temp;
  }

  console.log("above??")
  console.log(old_email)
  users.findOne({ email: email.toLowerCase() })
  .then((check) => {
    console.log("hi")
    console.log(check)
    if(!check || old_email.toLowerCase() === email){
      console.log("in here")
      // check being false means we didnt find another user w/ this email or old email is not changed so we good
      // we want to send a reset email email if the email is different and its not in use
      users.updateOne({ _id: user_id }, { $set: { first_name, last_name, "phone_num": stringPhone_num }})
      .then((doc) => {
        console.log("in in here")
        // console.log(old_email.toLowerCase)
        // console.log(email)
        // console.log(old_email.to)
        if(old_email.toLowerCase() !== email){
          console.log("abcd")
          // send email w/ link to /user/auth
          var rand = Math.floor((Math.random() * 100) + 54);
          var host = req.get('host');
          var date = new Date();
          
          var obj1 = {};
          obj1["chagEmail"] =  { rand, host, date, "email": email.toLowerCase() };
          users.updateOne({ _id: ObjectID(req.user.id) }, { $set: obj1 }).then(() => {
            const link1 = "https://" + req.get('host') + "/user/auth?id=" + rand + "&o=" + req.user.id;
            console.log(link1)

            // const output = `
            // <p>Thomas Yarnell Photography Confirmation Email</p>
            // <p>It seems that you changed your email address. Click this <a href="${link1}">link</a> to verify your new email address.</p>
            // <p>\n\nThe link will expire in 1 hour</p>
            // `;

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
                        <h1 style="font-size: 24px; margin: 0;">New Email Confirmation</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Hi ${first_name},<br></p>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">You recently requested to reset your email.<br><br>Click the link below (expires in 60 mins) to confirm your email: </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #153643; font-family: Arial; font-size: 18px; line-height: 24px; padding: 0 0 0 0;">
                            <a href="${link1}">Confirm Email</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 30px 0;">
                            <p style="margin: 0;"><br>or paste the following link into your browser: <br>${link1}</p>
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

            console.log("abcde")

            const options = {
              from: "thomasyarnellphotos@gmail.com",
              to: email,
              subject: "Thomas Yarnell Photography | New Email Confirmation",
              html: output
            };

            transporter.sendMail(options, function (err, info) {
              if (err) {
                res.sendStatus(400);
                return;
              }

              console.log("email sent")

              if(old_password !== undefined && req.user.password !== undefined && new_password !== undefined){
                const hashed_password = encrypt(new_password);
                users.updateOne({ _id: user_id}, { $set: { "password": hashed_password.content, "iv": hashed_password.iv } })
                .then(() => {
                  res.sendStatus(200);
                  return;
                })
                .catch((err) => {
                  res.sendStatus(400);
                  return;
                  // req.flash('error', 'Error updating user info');
                });
              }
              else{
                res.sendStatus(200);
                return;
              }

            });
          })
          .catch((err) => {
            res.sendStatus(400);
            return;
          })
          
        }
        else{
          console.log("else")

          // console.log(doc.documents)
          console.log(old_password)
          console.log(old_password !== undefined)
          console.log(doc.password)
          console.log(doc.password !== undefined)
          console.log(new_password)
          console.log(new_password !== undefined)
          if(old_password !== undefined && req.user.password !== undefined && new_password !== undefined){
            console.log("hi i here!")
            const hashed_password = encrypt(new_password);
            users.updateOne({ _id: user_id}, { $set: { "password": hashed_password.content, "iv": hashed_password.iv } })
            .then(() => {
              res.sendStatus(200);
              return;
            })
            .catch((err) => {
              res.sendStatus(400);
              return;
              // req.flash('error', 'Error updating user info');
            });
          }
          else{
            res.sendStatus(200);
            return;
          }

        }

        console.log("ewewfew")
        
      })
      .catch((err) => {
        console.log("ofjwefowuefew")
        res.sendStatus(400);
        return;
      });

    }
    else{
      console.log("408")
      res.sendStatus(408);
      return;
    }
  })
  .catch((err) => {
    res.sendStatus(400);
    return;
  });


  // grab regular user stuffs
  // const users = req.app.locals.users;
  // const user_id = ObjectID(req.user.id);
  // const old_email = req.body.old_email;

  // // boolean to confirm old_password has been verified
  // var old_pass = false;

  // // loop through all inputs
  // for (var key in req.body) {
  //   if (req.body.hasOwnProperty(key)) {
  //     item = req.body[key];

  //     // check if the key to update is the password
  //     if(key === "old_password"){
  //       if(decrypt( { iv: req.user.iv, content: req.user.password }) === item){
  //         old_pass = true;
  //         continue;
  //       }
  //       else{
  //         // req.flash('error', 'Incorrect password');
  //         res.sendStatus(401);
  //         return;
  //       }
  //     }

  //     // check if the key to update is the new password 
  //     var obj = {}; 
  //     if(key === "new_password"){
  //       if(!passwordCheckRegex(atob(item))){
  //         // req.flash('error', 'Password Not Complex Enough (Must Contain 1 Lowercase and 1 Uppercase Letter, and Length of 8)')
  //         res.sendStatus(400);
  //         return;
  //       }
  //       else if(!old_pass){
  //         // req.flash('error', 'Old Password Not Entered')
  //         res.sendStatus(400);
  //         return;
  //       }
  //       else{
  //         const hashed_password = encrypt(item);
  //         users.updateOne({ _id: user_id}, { $set: { "password": hashed_password.content, "iv": hashed_password.iv } })
  //         .then(() => {

  //         })
  //         .catch((err) => {
  //           res.sendStatus(400);
  //           // req.flash('error', 'Error updating user info');
  //         });
  //         continue;
  //       }
        
  //     }


  //     if(key === "first_name"){
  //       if(!nameRegex(item)){
  //         // req.flash('error', 'First Name not valid, please enter a valid Last Name')
  //         res.sendStatus(400);
  //         return;
  //       }
  //     }

  //     if(key === "last_name"){
  //       if(!nameRegex(item)){
  //         // req.flash('error', 'Last Name not valid, please enter a valid Last Name')
  //         res.sendStatus(400);
  //         return;
  //       }
  //     }

  //     if(key === "phone_num"){
  //       if(!phoneNumRegex(item)){
  //         // req.flash('error', 'Phone Number not accepted, please enter a valid Phone Number')
  //         res.sendStatus(400);
  //         return;
  //       }

  //       // convert phone_num into various formats
  //       var stringPhone_num = item.toString().replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(" ", "");
  //       if(stringPhone_num.length === 10){
  //         var temp = "(" + stringPhone_num.slice(0, 3) + ")-" + stringPhone_num.slice(3, 6) + "-" + stringPhone_num.slice(6, 10);
  //         item = temp;
  //       }
  //       else if(stringPhone_num.length === 11){
  //         var temp = stringPhone_num.slice(0, 1) + " (" + stringPhone_num.slice(1, 4) + ")-" + stringPhone_num.slice(4, 7) + "-" + stringPhone_num.slice(7, 11);
  //         item = temp;
  //       }
  //     }

  //     if(key === "email"){
  //       if (!validator.validate(item)) {
  //         // console.log('Email Format not Valid')
  //         res.sendStatus(400);
  //         return;
  //       }
  //       else if(!old_pass){
  //         // console.log('Old Password Not Entered')
  //         res.sendStatus(400);
  //         break;
  //       }
  //       else{
  //         users.findOne( { email: item.toLowerCase() })
  //         .then((check) => {
  //           if(!check || item.toLowerCase() === old_email){
  //             var rand = Math.floor((Math.random() * 100) + 54);
  //             var host = req.get('host');
  //             var date = new Date();
              
  //             var obj1 = {};
  //             obj1["chagEmail"] =  { rand, host, date, item: item.toLowerCase() };
  //             users.updateOne({ _id: ObjectID(req.user.id) }, { $set: obj1 })
  //             .then((doc) => {
  //               // send email w/ link to reset
  //               const link1 = "https://" + req.get('host') + "/user/auth?id=" + rand + "&o=" + req.user.id;
    
  //               const output = `
  //               <p>Thomas Yarnell Photography Confirmation Email</p>
  //               <p>It seems that you changed your email address. Click this <a href="${link1}">link</a> to verify your new email address.</p>
  //               <p>\n\nThe link will expire in 1 hour</p>
  //               `;
    
  //               const options = {
  //                 from: "thomasyarnellphotos@gmail.com",
  //                 to: item,
  //                 subject: "Thomas Yarnell Photography New Email Confirmation",
  //                 html: output
  //               };
                
  //               transporter.sendMail(options, function (err, info) {
  //                 if (err) {
    
  //                   res.sendStatus(400);
  //                   return;
  //                 }
                  
  //                 res.sendStatus(200);
    
  //               });
    
  //             })
  //             .catch((err) => {
  //               // req.flash('error', 'Error updating user email');
  //               res.sendStatus(400);
  //               return;
  //             });
  //           }
  //           else{
  //             // email alr exists
  //             res.sendStatus(408);
  //             return;
  //           }
  //         })
  //         .catch((err) => {

  //         });

          

  //       }
  //     }

  //     if(key != "email" && key != "new_password" && key != "old_password"){
  //       // update user properties
  //       obj[key] = item;
  //       users.updateOne({ _id: user_id }, { $set: obj })
  //       .then(() => {

  //       })
  //       .catch((err) => {
  //         // req.flash('error', 'Error updating user info');
  //         res.sendStatus(400)
  //       });
  //     }
      
  //   }
  // }
  // // this probably needs to be in a callback or something??? might send 200 when it should be something else
  console.log("very bottom")
});

// GET /user/auth
  // new email for user
router.get('/user/auth', (req, res, next) => {
  // grab users db 
  const users = req.app.locals.users;

  // find user document
  users.findOne({ _id: ObjectID(req.query.o) })
  .then(doc => {
    // validate that date is within 60 minutes
    var date = new Date(new Date().getTime() - (600000 * 6));
    if(doc.chagEmail.date < date){
      // req.flash('error', '60 minutes has passed, please register again')
      console.log("thwieuhfoweh")
      res.redirect('/signup')
      res.sendStatus(400);
      return;
    }

    // check that request is coming from a valid source
    if ((req.protocol + "://" + req.get('host')) === ("https://" + doc.chagEmail.host) || (req.protocol + "://" + req.get('host')) === ("http://" + doc.chagEmail.host)) {
      // confirm the random num
      console.log("WOwfewfe")
      if (req.query.id == doc.chagEmail.rand) {
        // grab regular stuffs and encrypts
        console.log("wiodenwofe")
        const users = req.app.locals.users;
        if (!validator.validate(doc.chagEmail.email)) {
          // req.flash('error', 'Email Format not Valid')
          res.redirect('/signup')
          res.sendStatus(400);
          return;
        }        

        // update user email
        users.updateOne({ _id: ObjectID(req.query.o) }, { $set: { "email": doc.chagEmail.email }})
        .then(() => {

        })
        .catch((err) => {
          // req.flash('error', 'Error updating email');
          res.sendStatus(400);
          res.redirect('/signup')
        });

        // delete verification vars
        users.updateOne({ _id: ObjectID(req.query.o) }, { $unset: { chagEmail: "" }})
        .then(() => {
          res.redirect('/dashboard');
          res.sendStatus(200);
          return;
        })
        .catch((err) => {
          // req.flash('error', 'Error updating email');
          // res.sendStatus(400);
          res.redirect('/signup')
        });

      }
      else{
        // req.flash('error', 'Not verified, please try again')
        res.sendStatus(400)
        res.redirect('/signup')
      }
    }
    else{
      // req.flash('error', 'Request from unknown site')
      res.sendStatus(400)
      res.redirect('/signup')
    }

  })
  .catch(err => {
    // req.flash('error', 'Cannot find the document')
    res.sendStatus(400)
    res.redirect('/signup')
  });

});

// post register
  // takes all user info as prerequisites
router.post('/register', (req, res, next) => {  
  // data and info from user input as well as encrypts and databases (standard stuffs)
  const { first_name, last_name, password, email, phone_num } = req.body;
  const users = req.app.locals.users;
  const false_users = req.app.locals.false_users;
  const hashedP = encrypt(password).content;
  const hashedF = encryptRando(first_name).content;
  const hashedL = encryptRando(last_name).content;
  const hashedE = encryptRando(email.toLowerCase()).content;
  
  // convert phone_num into various formats
  var stringPhone_num = phone_num.toString().replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(" ", "");
  if(stringPhone_num.length === 10){
    var temp = "(" + stringPhone_num.slice(0, 3) + ")-" + stringPhone_num.slice(3, 6) + "-" + stringPhone_num.slice(6, 10);
    stringPhone_num = temp;
  }
  else if(stringPhone_num.length === 11){
    var temp = stringPhone_num.slice(0, 1) + " (" + stringPhone_num.slice(1, 4) + ")-" + stringPhone_num.slice(4, 7) + "-" + stringPhone_num.slice(7, 11);
    stringPhone_num = temp;
  }

  const hashedPh = encryptRando(stringPhone_num).content;
  iv = encrypt(password).iv;

  // check email format
  if (!validator.validate(email)) {
    // req.flash('error', 'Email Format not Valid')
    res.sendStatus(400);
  }
  // check phone number validation
  else if(!phoneNumRegex(phone_num)){
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
  // check password complexity
  else if(!passwordCheckRegex(atob(password))){
    // req.flash('error', 'Password Not Complex Enough (Must Contain 1 Lowercase and 1 Uppercase Letter, and Length of 8)')
    res.sendStatus(400);
  }
  else{
    users
      .findOne( { email: email.toLowerCase() })
      .then(user => {
        // email has already been registered
        if (user) {
          // req.flash('error', 'Email is already in the database')
          res.sendStatus(400).end();
          return;
        }
        else {
          // create verification vars and add info to false_users db
          var rand = Math.floor((Math.random() * 100) + 54);
          var host = req.get('host');
          var date = new Date();
          
          false_users
          .insertOne({ hashedP, hashedF, hashedL, hashedE, hashedPh, rand, host, date, iv })
          .then((doc) => {
            
            // send email w/ link to auth
            const link = "https://" + req.get('host') + "/auth?id=" + doc.insertedId + "&r=" + rand

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
						<h1 style="font-size: 24px; margin: 0;">Account Confirmation</h1>
					</td>
				</tr>
        <tr>
					<td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                <p style="margin: 0;">Hi ${first_name},<br></p>
					</td>
				</tr>
				<tr>
					<td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                <p style="margin: 0;">Thank you for registering an account at <a href="https://thomasyarnell.com">Thomas Yarnell Photography</a>. We're excited to be able to capture timeless memories with you.<br><br>Click the link below (expires in 60 mins) to confirm your email: </p>
					</td>
				</tr>
        <tr>
          <td style="color: #153643; font-family: Arial; font-size: 18px; line-height: 24px; padding: 0 0 0 0;">
                <a href="${link}">Confirm Email</a>
					</td>
        </tr>
        <tr>
					<td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 30px 0;">
                <p style="margin: 0;"><br>or paste the following link into your browser: <br>${link}</p>
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

            console.log("inside there")
              const options = {
                from: "thomasyarnellphotos@gmail.com",
                to: email,
                subject: "Thomas Yarnell Photography | New Account Confirmation",
                // priority: "high",
                // attachments: [
                //   {
                //     filename: 'email.html',
                //     path: './emai.html'
                //   }
                // ],
                html: output//NoTemplate
              };
              
              transporter.sendMail(options, function (err, info) {
                if (err) {
                  console.log(err)
                  res.sendStatus(400);
                  return;
                }
                res.sendStatus(200);
              });

            })
            .catch((err) => {
              // req.flash('error', 'We could not update the configdb: ' + err);
              console.log(err)
              res.sendStatus(400);
            });

          }

        });
        
      }

});

// get auth
  // link in the /register email
router.get('/auth', (req, res, next) => {
  // grab false_users db
  const false_users = req.app.locals.false_users;
  false_users.findOne({ _id: ObjectID(req.query.id)})
  .then(doc => {
    
    // validate that date is within 60 minutes
    var date = new Date(new Date().getTime() - (600000 * 6));
    if(doc.date < date){
      // req.flash('error', '60 minutes has passed, please register again')
      console.log("a")
      res.sendStatus(400);
      return;
    }
    
    // check that request is coming from a valid source
    // console.log(req.protocol + "://" + req.get('host'))
    // console.log(doc.host)
    if ((req.protocol + "://" + req.get('host')) === ("http://" + doc.host) || + (req.protocol + "://" + req.get('host') === ("https://" + doc.host))) {
      console.log("in here")
      // confirm the random num
      // console.log(req.query.r)
      // console.log(doc.rand)
      if (req.query.r == doc.rand) {
        // grab regular stuffs and decrypts
        // console.log("hihihihihihihh")
        const users = req.app.locals.users;
        iv = doc.iv;
        const first_name = decryptRando({ iv, content: doc.hashedF });
        const last_name = decryptRando({ iv, content: doc.hashedL });
        const email = decryptRando({ iv, content: doc.hashedE });;
        const phone_num = decryptRando({ iv, content: doc.hashedPh })
        const hashedPassword = doc.hashedP;

        // insert all user data into official user db
        users
          .insertOne({ first_name, last_name, password: hashedPassword, email, phone_num, iv, "cart": [], "favorites": [], "bookings": [] })
          .then(() => {
            
          })
          .catch((err) => {
            // req.flash('error', 'Error registering user');
            // console.log("b")
            // res.sendStatus(400);
            res.redirect('/signup')
            return;
        });

        // delete the user data from false_users db
        false_users
          .deleteOne({ _id: ObjectID(req.query.id)})
          .then(() => {

          })
          .catch((err) => {
            // req.flash('error', 'false Error registering user');
            // console.log("c")
            // res.sendStatus(400)
            res.redirect('/signup')
            return;
          });
        
        // loop through and delete all false_users outside of 10 mins
        var cursor = false_users.find();
        cursor.each(function(err, doc) {
          if(err){
            res.redirect('/signup');
            // throw err;
          } 
          if(doc){
            var date = new Date(new Date().getTime() - 600000);
            if(doc.date < date){
              false_users.deleteOne(doc)
            }
          } 
        });  
        
        res.redirect('/dashboard');
        // res.sendStatus(200);
      }
      else{
        // req.flash('error', 'Not verified, please register again')
        // console.log("d")
        // res.sendStatus(400);
        res.redirect('/signup');
      }
    }
    else{
      // req.flash('error', 'Request from unknown site')
      // console.log("e")
      // res.sendStatus(400);
      res.redirect('/signup');
    }
  })
  .catch(err =>{
    // req.flash('error', 'Cannot find the document')
    // console.log("f")
    // res.sendStatus(400);
    res.redirect('/signup');
  })
});


// get user/bookings
router.get('/user/bookings', ensureAuthenticated, (req, res, next) => {
  // grab basic stuffs
  const userid  = ObjectID(req.user.id);
  const users = req.app.locals.users;
  const bookings = req.app.locals.bookings;

  // find the user and grab their information
  // proceed to send bookings 
  users.findOne(userid)
  .then(doc => {
    var bookingArray = doc.bookings.map(bookingid => {
      return bookings.findOne(ObjectID(bookingid)).then().catch()
    });

    Promise.all(bookingArray)
    .then((bookingdoc) => {
      res.send(bookingdoc)
    })
    .catch(err => {
      res.sendStatus(400)
      // throw err
    })  

  })
  .catch(err => {
    res.sendStatus(400)
    // throw err
  })
});

router.get('/logout', function(req, res){
  req.logOut();
  res.sendStatus(200);
});


module.exports = router;
