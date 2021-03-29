// basic imports
var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const ObjectID = require('mongodb').ObjectID;
const fs = require('fs');
var validator = require("email-validator");
const readline = require('readline');
const {google} = require('googleapis');
var CronJob = require('cron').CronJob;
const schedule = require('node-schedule');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();

// const job = schedule.scheduleJob(new Date(new Date().getTime() + 1000*60), function(){
//     console.log("scheduling");
// });

// create nodemailer transport to send emails 
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thomasyarnellphotos@gmail.com",
      pass: process.env.PASSWORD
    }
});

// var errday = new CronJob(
//     '0 0 9,13,17 * * *',
//     // '0 31 21 * * *', 
//     function(){
//         console.log('Every day');
//         // connect to mongodb
//         MongoClient.connect(process.env.MONGOURI, (err, client) => {
//             if (err) {
//                 throw err;
//             }
//             // store dbs
//             const db = client.db('photodb')
//             const bookings = db.collection('bookings');
//             bookings.find().forEach(
//                 function(doc){
//                     console.log(doc)
//                     const now = new Date(new Date().setTime(new Date().getTime() - (7 * 60 * 60 * 1000)));
//                     const twofour = new Date(now.getTime() + (24 * 60 * 60 * 1000));
//                     // const foureight = new Date(now.getTime() + (48 * 60 * 60 * 1000));
//                     const docDate = new Date(doc.date);
//                     console.log(now)
//                     console.log(twofour);
//                     // console.log(foureight);
//                     console.log(docDate)
                    

//                     if(twofour <= new Date(docDate.getTime() + 1000 * 60 * 5)){
//                         console.log("wooo");

//                         const link = "https://thomasyarnell.com/dashboard";
                    
//                         var urlLocation = doc.location.replace(" ", "+");
//                         const staticMapLink = "https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C" + urlLocation + "&key=" + process.env.MAPAPI;  
                    
//                         const driving = "https://www.google.com/maps/dir/?api=1&destination=" + urlLocation + "&travelmode:driving&dir_action:navigate";

//                         // const streetView = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + lat + "," + long + "&fov=100";

//                         console.log(driving)
//                         // console.log(streetView)
//                         console.log(staticMapLink)


//                         const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
//                         <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
//                         <head>
//                             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
//                             <title>Demystifying Email Design</title>
//                             <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//                             <style type="text/css">
//                                 a[x-apple-data-detectors] {color: inherit !important;}
//                             @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@700&family=Source+Sans+Pro:wght@600&display=swap');
//                             </style>
//                         </head>
//                         <body style="margin: 0; padding: 0;">
//                             <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
//                                 <tr>
//                                     <td style="padding: 20px 0 30px 0;">
//                         <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-radius: 8px">
//                             <tr>
//                                 <td align="center" bgcolor="#e8980d" style="padding: 40px 0 30px 0;">
//                                     <img src="https://cdn.discordapp.com/attachments/762549545749839943/816206682060750888/logo_1.png">
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td bgcolor="#f0f0f0" style="padding: 40px 30px 40px 30px;">
//                                     <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
//                                         <tr>
//                                             <td style="color: #153643; font-family: Josefin Sans, sans-serif;">
//                                                 <h1 style="font-size: 24px; margin: 0;">Booking Confirmation</h1>
//                                             </td>
//                                         </tr>
//                                 <tr>
//                                             <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
//                                         <p style="margin: 0;">Hi ${doc.first_name},<br></p>
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
//                                         <p style="margin: 0;">As a reminder, you have an appointment booked with Thomas tomorrow. Here are the booking details:
//                                         </p>
//                                             </td>
//                                         </tr>
//                                 <tr>
//                                 <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
//                                     <ul style="list-style-type: none; line-height: 28px;">  
//                                         <li><strong>Name</strong>: ${doc.first_name}  ${doc.last_name}</li>
//                                         <li><strong>Email</strong>: ${doc.email}</li>
//                                         <li><strong>Phone</strong>: ${doc.phone_num}</li>
//                                         <li><strong>Location</strong>: ${doc.location}</li>
//                                         <li><a href="${doc.driving}" style="color: inherit">Directions</a> to ${doc.location}.</li>
//                                         <li><strong>Date</strong>: ${new Date(doc.date).toLocaleString('en-US')}</li>
//                                         <li><strong>Category</strong>: ${doc.type}</li>
//                                         <li><strong>Package</strong>: ${doc.package}</li>
//                                         <li><strong>Notes</strong>: ${doc.notes}</li>
//                                     </ul>
//                                 </td>
//                                 </tr>
//                                 <tr>
//                                 <td>
//                                     <a href="${"https://www.google.com/maps/place/" + urlLocation}"><img style="height: 400px; width: 600px;" src="https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C4141+Nogales%20Street,%20West%20Covina,%20CA,%20USA&zoom=18&key=AIzaSyAXnO5_29oeGqNIchVstCYS29QCI-wBJ0Q"></a>
//                                 </td>
//                                 </tr>
//                                 <tr>
//                                             <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
//                                     <p style="margin: 0;">Click <a style="color: inherit" href="${link}">here</a> to edit your booking.</p>
//                                             </td>
//                                         </tr>
//                                     </table>
//                                 </td>
//                             </tr>
//                         </table>
//                                     </td>
//                                 </tr>
//                             </table>
//                         </body>
//                         </html>`;
            
//                         const options = {
//                             from: "thomasyarnellphotos@gmail.com",
//                             to: doc.email,
//                             subject: "Thomas Yarnell Photography Reminder Appointment",
//                             html: output
//                         };
                            
//                         transporter.sendMail(options, function (err, info) {
//                             if (err) {
//                                 console.log(err);
//                                 return;
//                             }
//                         });
//                     }
//                 }
//             ).then(() => {}).catch((err) => {
//                 console.log(err)
//             });
//             // console.log(bookings)
//         });
//     },
//     null,
//     true,
//     'America/Los_Angeles'
// );

console.log("hih");
// var errday2 = new CronJob(
//     '0 48,49,50 13 * * *',
//     function(){
//         console.log("hi")
//         console.log(new Date().toLocaleString('en-us'));
//     },
//     null,
//     true,
//     'America/Los_Angeles'
// );

var errday1 = new CronJob(
    '0 0 9,13,17 * * *',
    // '0 31 21 * * *', 
    function(){
        console.log('Every day');
        // connect to mongodb
        MongoClient.connect(process.env.MONGOURI, (err, client) => {
            if (err) {
                throw err;
            }
            // store dbs
            const db = client.db('photodb')
            const bookings = db.collection('bookings');
            bookings.find().forEach(
                function(doc){
                    console.log(doc)
                    if(new Date() >= new Date(doc.date)){
                        console.log("we deleting this boii");
                        const users = db.collection("users");
                        const configdb = db.collection("configdb");

                        // var docdate;

                        console.log("hi")
                        console.log(doc._id)
                        bookings.deleteOne({ _id: doc._id })
                        .then((test) => {
                            // console.log(test)
                            console.log("bookings deleted")    
                            console.log(doc.date)
                            configdb.updateOne({ _id: ObjectID(process.env.CONFIGDB) }, { $pull: { used_bookings: doc.date }})
                            .then((test1) => {
                                // console.log(test1)
                                console.log("configdb deleetted")

                                users
                                .updateOne({ _id: ObjectID(doc.userId) }, { $pull: { bookings: doc._id }})
                                .then((test2) => {
                                    // console.log(test2)
                                    console.log("useres deleeted")
                                })
                                .catch((err) => {
                                    console.log(err)
                                    return;
                                });
                            })
                            .catch((err) => {
                                console.log(err)
                                return;
                            });

                        }).catch((err) => {
                            console.log(err)
                            return;
                        });
                    }
                    //     // find the booking
                    //     bookings.findOne(doc._id)
                    //     .then(doc => {
                    //         // send a booking deleted email 
                    //         console.log("hi12")
                    //         // docdate = doc.date;
                    //         // delete the booking date from configdb global booking dates array
                    //         // console.log(docdate)
                    //         configdb
                    //             .updateOne({ _id: ObjectID(process.env.CONFIGDB) }, { $pull: { used_bookings: doc.date }})
                    //             .then(() => {
                    //                 users
                    //                 .updateOne({ _id: userid }, { $pull: { bookings: id }})
                    //                 .then(() => {
                    //                     // delete the booking from bookings db
                    //                     bookings
                    //                     .deleteOne({ _id: id })
                    //                     .then(() => {
                    //                         // res.sendStatus(200)
                    //                     })
                    //                     .catch((err) => {
                    //                         // req.flash('error', 'We could not delete the booking');
                    //                         // res.sendStatus(400)
                    //                         console.log(err)
                    //                         return;
                    //                     })
                    //                 })
                    //                 .catch((err) => {
                    //                     // req.flash('error', 'We could not delete the users booking');
                    //                     // res.sendStatus(400)
                    //                     console.log(err)
                    //                     return;
                    //                 })
                    //             .catch((err) => {
                    //                 // req.flash('error', 'We could not delete the configdb booking');
                    //                 console.log(err)
                    //                 return;
                    //                 // res.sendStatus(400)
                    //             })
                    //     })
                    //     .catch((err) => {
                    //         // req.flash('error', 'Error deleting booking');
                    //         console.log(err)
                    //         return;
                    //         // res.sendStatus(400)
                    //     })
                    // }


                    // console.log(doc)
                    else{
                        const now = new Date(new Date().setTime(new Date().getTime() - (7 * 60 * 60 * 1000)));
                        const twofour = new Date(now.setTime(now.getTime() + (24 * 60 * 60 * 1000)));
                        // const foureight = new Date(now.getTime() + (48 * 60 * 60 * 1000));
                        const docDate = new Date(doc.date);
                        console.log(now)
                        console.log(twofour);
                        // console.log(foureight);
                        console.log(docDate)
                        console.log("bwebiwebfiwbfiwebfiwe")
                        // console.log(new Date(twofour).getHour())
                        // console.log(twofour.getDate())
                        // console.log(twofour.getDay())
                        // console.log(docDate.getHour())
                        // console.log(docDate.getDate())
                        // console.log(docDate.getDay())
                        
                        console.log("docDate: " + docDate);
                        console.log("twofour: " + twofour)
                        if(twofour >= docDate){
                            console.log("wooo");
                            const check = new Date(docDate.setTime(docDate.getTime() + (1000 * 60 * 5)));
                            console.log("check: " + check)
                            
                            if(twofour < check){
                                const link = "https://thomasyarnell.com/dashboard";
                        
                                var urlLocation = doc.location.replace(" ", "+");
                                const staticMapLink = "https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C" + urlLocation + "&key=" + process.env.MAPAPI;  
                            
                                const driving = "https://www.google.com/maps/dir/?api=1&destination=" + urlLocation + "&travelmode:driving&dir_action:navigate";
        
                                // const streetView = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + lat + "," + long + "&fov=100";
        
                                console.log(driving)
                                // console.log(streetView)
                                console.log(staticMapLink)
        
        
                                const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                                        <h1 style="font-size: 24px; margin: 0;">Booking Reminder</h1>
                                                    </td>
                                                </tr>
                                        <tr>
                                                    <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                                                <p style="margin: 0;">Hi ${doc.first_name},<br></p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                                                <p style="margin: 0;">As a reminder, you have an appointment booked with Thomas tomorrow. Here are the booking details:
                                                </p>
                                                    </td>
                                                </tr>
                                        <tr>
                                        <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
                                            <ul style="list-style-type: none; line-height: 28px;">  
                                                <li><strong>Name</strong>: ${doc.first_name}  ${doc.last_name}</li>
                                                <li><strong>Email</strong>: ${doc.email}</li>
                                                <li><strong>Phone</strong>: ${doc.phone_num}</li>
                                                <li><strong>Location</strong>: <a href="${driving}" style="color: inherit">${doc.location.substring(0, doc.location.indexOf(","))}</a>${doc.location.substring(doc.location.indexOf(","), doc.location.length)}</li>
                                                <li><strong>Date</strong>: ${new Date(doc.date).toLocaleString('en-US')} PDT</li>
                                                <li><strong>Category</strong>: ${doc.type}</li>
                                                <li><strong>Package</strong>: ${doc.package}</li>
                                                <li><strong>Notes</strong>: ${doc.notes}</li>
                                            </ul>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <a href="${"https://www.google.com/maps/place/" + urlLocation}"><img style="height: 400px; width: 600px;" src="https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C4141+Nogales%20Street,%20West%20Covina,%20CA,%20USA&zoom=18&key=AIzaSyAXnO5_29oeGqNIchVstCYS29QCI-wBJ0Q"></a>
                                        </td>
                                        </tr>
                                        <tr>
                                                    <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                                            <p style="margin: 0;">Click <a style="color: inherit" href="${link}">here</a> to edit your booking.</p>
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
                                </html>`;
                    
                                const options = {
                                    from: "thomasyarnellphotos@gmail.com",
                                    to: doc.email,
                                    subject: "Thomas Yarnell Photography | Reminder Appointment",
                                    html: output
                                };
                                    
                                transporter.sendMail(options, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                });
                            }
                        }
                    }
                    
                }
            ).then(() => {}).catch((err) => {
                console.log(err)
            });
            // console.log(bookings)
        });
    },
    null,
    true,
    'America/Los_Angeles'
);

const SCOPES = ['https://www.googleapis.com/auth/calendar']

const TOKEN_PATH = 'google-credentials.json';

function authorize(callback) {
    // const {client_secret, client_id, redirect_uris} = credentials.installed;
    const client_secret = process.env.GBCLIENT_SECRET;
    const client_id = process.env.GBCLIENT_ID;
    const redirect_uris = process.env.GBREDIRECT_URIS;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris);
    
    fs.readFile(TOKEN_PATH, (err, token) => {
        if(err){
            return getAccessToken(oAuth2Client, callback);
        }

        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback){
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
}

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

  if (req.isAuthenticated()) {
    return next();
  }
  
  res.sendStatus(401)
};

//bookings
    //sends the booked booking dates
router.get('/booking', (req, res, next) => {
    // grab dbs
    const configdb = req.app.locals.configdb;

    var array;
    configdb
        .findOne({ _id: ObjectID(process.env.CONFIGDB) })
        .then(doc => {
            var current_date = new Date();
            // loops through and removes all old bookings
            for(var booking in doc.used_bookings){
                var booking_date = new Date(doc.used_bookings[booking]);
                if(booking_date < current_date){
                    configdb.updateOne({ _id: ObjectID(process.env.CONFIGDB )}, { $pull: { used_bookings: doc.used_bookings[booking] }})
                    .then(() => {
                      })
                      .catch((err) => {
                        res.sendStatus(400);
                      });
                }
            }
            array = doc.used_bookings; 
            res.send(array);
        })
        .catch((err) => {
            // req.flash('error', 'Couldnt get the condigdb info')
            res.sendStatus(400);
        });
    
});

// post /bookings
    // takes booking info as prerequisites
router.post('/bookings', (req, res, next) => {
    // basic req and dbs stuffs
    const { location, date, type, package, notes } = req.body;
    const { first_name, last_name, email, phone_num } = req.body; 
    const bookings = req.app.locals.bookings;
    const configdb = req.app.locals.configdb;
    const users = req.app.locals.users;
    console.log(req.body);

    // verify that the date is a valid date
    var new_date = new Date(date);
    if(!new_date instanceof Date || isNaN(new_date)){
        // req.flash('error', 'Not a valid date');
        res.sendStatus(400);
        return;
    }

    // check phone number validation
    if(!phoneNumRegex(phone_num)){
        // req.flash('error', 'Phone Number not accepted, please enter a valid Phone Number')
        res.sendStatus(400);
    }

    // check first name validation
    if(!nameRegex(first_name)){
        // req.flash('error', 'First Name not valid, please enter a valid First Name')
        res.sendStatus(400);
    }

    // check last name validation
    if(!nameRegex(last_name)){
        // req.flash('error', 'Last Name not valid, please enter a valid Last Name')
        res.sendStatus(400);
    }
    
    // check email format
    if (!validator.validate(email)) {
        // req.flash('error', 'Email Format not Valid')
        res.sendStatus(400);
    }

    // verify that the package is valid
    if(package != "Standard" && package != "Premium" && package != "Exclusive"){
        // req.flash('error', 'Incorrect package option');
        console.log('b')
        res.sendStatus(400);
        return;
    }
    
    // verify that the type is valid
    if(type != "Landscape" && type != "Modeling" && type != "Family Portraits" && type != "Graduations" && type != "Sports Events" && type != "Weddings" && type != "Other"){
        // incorrect type option
        console.log('c')
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

    console.log("hi")

    if(req.user){

        const id = req.user.id;
        const userid = ObjectID(id);
        var bookingid;

        // insert info into bookings db
        bookings
        .insertOne({ "userId": id, first_name, last_name, email, "phone_num": stringPhone_num, location, date, type, package, notes })
        .then((test) => {
            bookingid = test.insertedId;

            const link = "https://" + req.get('host') + "/dashboard";
            
            var urlLocation = location.replace(" ", "+");
            const staticMapLink = "https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C" + urlLocation + "&key=" + process.env.MAPAPI;  
            
            const driving = "https://www.google.com/maps/dir/?api=1&destination=" + urlLocation + "&travelmode:driving&dir_action:navigate";

            // const streetView = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + lat + "," + long + "&fov=100";

            console.log(driving)
            // console.log(streetView)
            console.log(staticMapLink)

            // const output = `
            // <p>Thomas Yarnell Photography Bookings</p>
            // <h3>Booking Details</h3>
            // <ul>  
            //     <li>Name: ${first_name}  ${last_name}</li>
            //     <li>Email: ${email}</li>
            //     <li>Phone: ${stringPhone_num}</li>
            //     <li>Location: ${location}</li>
            //     <li><a href="${driving}">Directions</a> to ${location}.</li>
            //     <!-- <img src="${staticMapLink}"> -->
            //     <li>Date: ${new Date(date).toLocaleString('en-US')}</li>
            //     <li>Type: ${type}</li>
            //     <li>Package: ${package}</li>
            //     <li>Notes: ${notes}</li>
            // </ul>
            // <h3>Thank you for your booking! Click this <a href=${link}>link</a> to edit your appointment</h3>
            // `;

            const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                    <h1 style="font-size: 24px; margin: 0;">Booking Confirmation</h1>
                                </td>
                            </tr>
                    <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Hi ${first_name},<br></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Thank you for booking with <a style="color: inherit" href="https://thomasyarnell.com">Thomas Yarnell Photography</a>. Thomas will contact you shortly. Here are your booking details: </p>
                                </td>
                            </tr>
                    <tr>
                      <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
                        <ul style="list-style-type: none; line-height: 28px;">  
                            <li><strong>Name</strong>: ${first_name}  ${last_name}</li>
                            <li><strong>Email</strong>: ${email}</li>
                            <li><strong>Phone</strong>: ${stringPhone_num}</li>
                            <li><strong>Location</strong>: <a href="${driving}" style="color: inherit">${location.substring(0, location.indexOf(","))}</a>${location.substring(location.indexOf(","), location.length)}</li>
                            <li><strong>Date</strong>: ${new Date(date).toLocaleString('en-US')} PDT</li>
                            <li><strong>Category</strong>: ${type}</li>
                            <li><strong>Package</strong>: ${package}</li>
                            <li><strong>Notes</strong>: ${notes}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="${"https://www.google.com/maps/place/" + urlLocation}"><img style="height: 400px; width: 600px;" src="https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C4141+Nogales%20Street,%20West%20Covina,%20CA,%20USA&zoom=18&key=AIzaSyAXnO5_29oeGqNIchVstCYS29QCI-wBJ0Q"></a>
                      </td>
                    </tr>
                    <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                        <p style="margin: 0;">Click <a style="color: inherit" href="${link}">here</a> to edit your booking.</p>
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
            </html>`;

            const options = {
                from: "thomasyarnellphotos@gmail.com",
                to: email,
                subject: "Thomas Yarnell Photography | Booking",
                html: output
            };
                
            transporter.sendMail(options, function (err, info) {
                if (err) {
                    res.sendStatus(400)
                    return;
                }

                // add bookingid to the user's booking array
                users
                    .updateOne({ _id: userid }, { $push: { bookings: bookingid }})
                    .then(() => {

                        // add booking date to global used_bookings array
                        configdb
                        .updateOne({ _id: ObjectID(process.env.CONFIGDB) }, { $push: { used_bookings: date }})
                        .then(() => {

                            // send email w/ booking info
                            // fs.readFile('./credentials.json', (err, content) => {
                                // if(err){
                                    // return console.log('Error loading client secret file: ', err);
                                // }
                                authorize(listEvents)
                            // });

                            function listEvents(auth) {
                                const calendar = google.calendar({version: 'v3', auth});
                                
                                var dateObj = new Date(date);
                                var firstDate;
                                if((dateObj > new Date("2021-03-14T00:00:00.000Z") && dateObj < new Date("2021-11-07T00:00:00.000Z")) || dateObj > new Date("2022-03-13T00:00:00.000Z")){
                                    firstDate = new Date(dateObj.setTime(dateObj.getTime() + (7 * 60 * 60 * 1000)));
                                }
                                else{
                                    firstDate = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
                                }
//                                 var firstDateUse = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
                                // var newDate = new Date(date.setTime(date.getTime() + (8 * 60 * 60 * 1000)));
                                var newerDate;
                                if(package === "Standard"){
                                    // console.log(newDate);
                                    newerDate = new Date(dateObj.setTime(dateObj.getTime() + (1 * 60 * 60 * 1000))).toISOString();
                                    // newerDate = newerDate.toISOString();
                                    // console.log(newerDate);
                                }
                                else if(package === "Premium"){
                                    newerDate = new Date(dateObj.setTime(dateObj.getTime() + (1.5 * 60 * 60 * 1000))).toISOString();
                                }
                                else if(package === "Exclusive"){
                                    newerDate = new Date(dateObj.setTime(dateObj.getTime() + (2 * 60 * 60 * 1000))).toISOString();
                                }
                                else{
                                    res.sendStatus(400)
                                    return;
                                }
                                
                                var event = {
                                'summary': 'Thomas Yarnell Photoshoot',
                                'status': 'confirmed',
                                'location': location, //'409 Mockingbird Lane, Walnut, CA, USA',
                                'description': 'Category: ' + type + '\nPackage: ' + package + '\nNotes: ' + notes,
                                'start': {
                                'dateTime':  firstDate.toISOString(), // change to booking date
                                'timeZone': 'America/Los_Angeles',
                                },
                                'end': {
                                'dateTime': newerDate, // add however many hours as package is
                                'timeZone': 'America/Los_Angeles',
                                },
                                'attendees': [
                                {'email': 'thomasyarnellphotos@gmail.com', 'responseStatus': 'accepted', 'comment': 'Please arrive on time!'}, // do we need this line? p sure we do ...
                                {'email': email, 'responseStatus': 'accepted'}, // replace w/ user email
                                ],
                            };
                            
                            calendar.events.insert({
                                auth: auth,
                                calendarId: 'primary',
                                resource: event,
                                sendUpdates: 'all'
                            }, function(err, event) {
                                if (err) {
                                console.log('There was an error contacting the Calendar service: ' + err);
                                return;
                                }
                                console.log('Event created: %s', event.data);

                                    bookings.updateOne({ _id: ObjectID(bookingid) }, { $set: { "eventId": event.data.id } })
                                    .then(() => {
                                        res.sendStatus(200)
                                    })
                                    .catch((err) => {
                                        res.sendStatus(400)
                                        return;
                                    })
                                
                                });
                            }

                            res.sendStatus(200)
                        })
                        .catch((err) => {
                            // req.flash('error', 'User couldnt get the configdb info')
                            res.sendStatus(400)
                        });

                    })
                    .catch((err) => {
                        // req.flash('error', 'User couldnt get the booking info')
                        res.sendStatus(400)
                    });

            });

        })
        .catch((err) => {
            // req.flash('error', 'We could not create the booking');
            console.log(err)
            res.sendStatus(400)
        });

    }
    else{
        var bookingid;
        console.log("woeewr")
        // insert info into bookings db
        // console.log()
        bookings
        .insertOne({ first_name, last_name, email, "phone_num": stringPhone_num, location, date, type, package, notes })
        .then((test) => {
            bookingid = test.insertedId;

            var urlLocation = location.replace(" ", "+");
            const staticMapLink = "https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C" + urlLocation + "&key=" + process.env.MAPAPI;  
            
            const driving = "https://www.google.com/maps/dir/?api=1&destination=" + urlLocation + "&travelmode:driving&dir_action:navigate";

            // const streetView = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + lat + "," + long + "&fov=100";

            console.log(driving)
            // console.log(streetView)
            console.log(staticMapLink)

            // const output = `
            // <p>Thomas Yarnell Photography Bookings</p>
            // <h3>Booking Details</h3>
            // <ul>  
            //     <li>Name: ${first_name}  ${last_name}</li>
            //     <li>Email: ${email}</li>
            //     <li>Phone: ${stringPhone_num}</li>
            //     <li>Location: ${location}</li>
            //     <li><a href="${driving}">Directions</a> to ${location}.</li>
            //     <!-- <img src="${staticMapLink}"> -->
            //     <li>Date: ${new Date(date).toLocaleString('en-US')}</li>
            //     <li>Type: ${type}</li>
            //     <li>Package: ${package}</li>
            //     <li>Notes: ${notes}</li>
            // </ul>
            // <h3>Thank you for your booking!</h3>
            // `;

            const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                    <h1 style="font-size: 24px; margin: 0;">Booking Confirmation</h1>
                                </td>
                            </tr>
                    <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Hi ${first_name},<br></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Thank you for booking with <a style="color: inherit" href="https://thomasyarnell.com">Thomas Yarnell Photography</a>. Thomas will contact you shortly. Here are your booking details: </p>
                                </td>
                            </tr>
                    <tr>
                      <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
                        <ul style="list-style-type: none; line-height: 28px;">  
                            <li><strong>Name</strong>: ${first_name}  ${last_name}</li>
                            <li><strong>Email</strong>: ${email}</li>
                            <li><strong>Phone</strong>: ${stringPhone_num}</li>
                            <li><strong>Location</strong>: <a href="${driving}" style="color: inherit">${location.substring(0, location.indexOf(","))}</a>${location.substring(location.indexOf(","), location.length)}</li>
                            <li><strong>Date</strong>: ${new Date(date).toLocaleString('en-US')} PDT</li>
                            <li><strong>Category</strong>: ${type}</li>
                            <li><strong>Package</strong>: ${package}</li>
                            <li><strong>Notes</strong>: ${notes}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="${"https://www.google.com/maps/place/" + urlLocation}"><img style="height: 400px; width: 600px;" src="https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C4141+Nogales%20Street,%20West%20Covina,%20CA,%20USA&zoom=18&key=AIzaSyAXnO5_29oeGqNIchVstCYS29QCI-wBJ0Q"></a>
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
            </html>`;
            console.log("hey")

            const options = {
                from: "thomasyarnellphotos@gmail.com",
                to: email,
                subject: "Thomas Yarnell Photography | Booking",
                html: output,
            };
                
            transporter.sendMail(options, function (err, info) {
                if (err) {
                    res.sendStatus(400)
                    return;
                }

                // add booking date to global used_bookings array
                configdb
                .updateOne({ _id: ObjectID(process.env.CONFIGDB) }, { $push: { used_bookings: date }})
                .then(() => {

                    // send email w/ booking info
                    // fs.readFile('./credentials.json', (err, content) => {
                        // if(err){
                            // return console.log('Error loading client secret file: ', err);
                        // }
                        console.log("hi1")
                        authorize(listEvents)
                    // });

                    function listEvents(auth) {
                        const calendar = google.calendar({version: 'v3', auth});

                        var dateObj = new Date(date);
                        var firstDate;
                        if((dateObj > new Date("2021-03-14T00:00:00.000Z") && dateObj < new Date("2021-11-07T00:00:00.000Z")) || dateObj > new Date("2022-03-13T00:00:00.000Z")){
                            firstDate = new Date(dateObj.setTime(dateObj.getTime() + (7 * 60 * 60 * 1000)));
                        }
                        else{
                            firstDate = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
                        }

                        // var dateObj = new Date(date);
                        // var firstDate = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
//                                 var firstDateUse = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
                        // var newDate = new Date(date.setTime(date.getTime() + (8 * 60 * 60 * 1000)));
                        var newerDate;
                        if(package === "Standard"){
                            // console.log(newDate);
                            newerDate = new Date(dateObj.setTime(dateObj.getTime() + (1 * 60 * 60 * 1000))).toISOString();
                            // newerDate = newerDate.toISOString();
                            // console.log(newerDate);
                        }
                        else if(package === "Premium"){
                            newerDate = new Date(dateObj.setTime(dateObj.getTime() + (1.5 * 60 * 60 * 1000))).toISOString();
                        }
                        else if(package === "Exclusive"){
                            newerDate = new Date(dateObj.setTime(dateObj.getTime() + (2 * 60 * 60 * 1000))).toISOString();
                        }
                        else{
                            res.sendStatus(400)
                            return;
                        }
                        
                        var event = {
                        'summary': 'Thomas Yarnell Photoshoot',
                        'status': 'confirmed',
                        'location': location, //'409 Mockingbird Lane, Walnut, CA, USA',
                        'description': 'Category: ' + type + '\nPackage: ' + package + '\nNotes: ' + notes,
                        'start': {
                        'dateTime':  firstDate.toISOString(), // change to booking date
                        'timeZone': 'America/Los_Angeles',
                        },
                        'end': {
                        'dateTime': newerDate, // add however many hours as package is
                        'timeZone': 'America/Los_Angeles',
                        },
                        'attendees': [
                        {'email': 'thomasyarnellphotos@gmail.com', 'responseStatus': 'accepted', 'comment': 'Please arrive on time!'}, // do we need this line? p sure we do ...
                        {'email': email, 'responseStatus': 'accepted'}, // replace w/ user email
                        ],
                    };
                    
                    calendar.events.insert({
                        auth: auth,
                        calendarId: 'primary',
                        resource: event,
                        sendUpdates: 'all'
                    }, function(err, event) {
                        if (err) {
                        console.log('There was an error contacting the Calendar service: ' + err);
                        return;
                        }
                        console.log('Event created: %s', event.data);

                            bookings.updateOne({ _id: ObjectID(bookingid) }, { $set: { "eventId": event.data.id } })
                            .then(() => {
                                res.sendStatus(200)
                            })
                            .catch((err) => {
                                res.sendStatus(400)
                                return;
                            })
                        
                        });
                    }
                })
                .catch((err) => {
                    // req.flash('error', 'User couldnt get the configdb info')
                    res.sendStatus(400)
                });

            });

        })
        .catch((err) => {
            // req.flash('error', 'We could not create the booking');
            console.log(err)
            res.sendStatus(400)
        });

    }

});


// patch /bookings/:id
    // takes all changed booking info param as a prerequisites
router.patch('/bookings/:id', ensureAuthenticated, (req, res, next) => {
    // grab db and id
    const id = ObjectID(req.params.id);
    const bookings = req.app.locals.bookings;
    const configdb = req.app.locals.configdb;
    
    const { location, date, type, package, notes } = req.body;
    const { first_name, last_name, email, phone_num, old_date, eventId } = req.body; 

    // verify that the date is a valid date
    var new_date = new Date(date);
    if(!new_date instanceof Date || isNaN(new_date)){
        // req.flash('error', 'Not a valid date');
        res.sendStatus(400);
        return;
    }
    // check phone number validation
    else if(!phoneNumRegex(phone_num)){
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
    
    // verify that the package is valid
    if(package != "Standard" && package != "Premium" && package != "Exclusive"){
        // req.flash('error', 'Incorrect package option');
        console.log('b')
        res.sendStatus(400);
        return;
    }
    
    // verify that the type is valid
    if(type != "Landscape" && type != "Modeling" && type != "Family Portraits" && type != "Graduations" && type != "Sports Events" && type != "Weddings" && type != "Other"){
        // incorrect type option
        console.log('c')
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
    
    bookings.findOneAndUpdate({ _id: id }, { $set: { first_name, last_name, email, "phone_num": stringPhone_num, location, date, type, package, notes } })
    .then((test) => {
        console.log(test)
        if(test.value !== null){
            console.log("IF")
            // send email
            const link = "https://" + req.get('host') + "/dashboard";
            
            var urlLocation = location.replace(" ", "+");
            const staticMapLink = "https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C" + urlLocation + "&key=" + process.env.MAPAPI;  
            
            const driving = "https://www.google.com/maps/dir/?api=1&destination=" + urlLocation + "&travelmode:driving&dir_action:navigate";

            // const streetView = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + lat + "," + long + "&fov=100";

            console.log(driving)
            // console.log(streetView)
            console.log(staticMapLink)

            // const output = `
            // <p>Thomas Yarnell Photography Updated Bookings</p>
            // <h3>Updated Booking Details</h3>
            // <ul>  
            // <li>Name: ${first_name}  ${last_name}</li>
            // <li>Email: ${email}</li>
            // <li>Phone: ${stringPhone_num}</li>
            // <li>Location: ${location}</li>
            // <li>Date: ${new Date(date).toLocaleString('en-US')}</li>
            // <li>Type: ${type}</li>
            // <li>Package: ${package}</li>
            // <li>Notes: ${notes}</li>
            // </ul>
            // <h3>Click this <a href=${link}>link</a> to edit your appointment</h3>
            // `;

            const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                    <h1 style="font-size: 24px; margin: 0;">Updated Booking</h1>
                                </td>
                            </tr>
                    <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Hi ${first_name},<br></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Here are your updated booking details: </p>
                                </td>
                            </tr>
                    <tr>
                      <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
                        <ul style="list-style-type: none; line-height: 28px;">  
                            <li><strong>Name</strong>: ${first_name}  ${last_name}</li>
                            <li><strong>Email</strong>: ${email}</li>
                            <li><strong>Phone</strong>: ${stringPhone_num}</li>
                            <li><strong>Location</strong>: <a href="${driving}" style="color: inherit">${location.substring(0, location.indexOf(","))}</a>${location.substring(location.indexOf(","), location.length)}</li>
                            <li><strong>Date</strong>: ${new Date(date).toLocaleString('en-US')} PDT</li>
                            <li><strong>Category</strong>: ${type}</li>
                            <li><strong>Package</strong>: ${package}</li>
                            <li><strong>Notes</strong>: ${notes}</li>
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="${"https://www.google.com/maps/place/" + urlLocation}"><img style="height: 400px; width: 600px;" src="https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C4141+Nogales%20Street,%20West%20Covina,%20CA,%20USA&zoom=18&key=AIzaSyAXnO5_29oeGqNIchVstCYS29QCI-wBJ0Q"></a>
                      </td>
                    </tr>
                    <tr>
                                <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                        <p style="margin: 0;">Click <a style="color: inherit" href="${link}">here</a> to edit your booking.</p>
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
            </html>`;
        
            const options = {
                from: "thomasyarnellphotos@gmail.com",
                to: email,
                subject: "Thomas Yarnell Photography | Updated Booking",
                html: output
            };
                
            transporter.sendMail(options, function (err, info) {
                if (err) {
                    res.sendStatus(400)
                    return;
                }
                
                // send email w/ booking info
                // fs.readFile('./credentials.json', (err, content) => {
                    // if(err){
                        // return console.log('Error loading client secret file: ', err);
                    // }
                    authorize(/*JSON.parse(content),*/ editEvents)
                // });

                function editEvents(auth) {
                    const calendar = google.calendar({version: 'v3', auth});

                    var dateObj = new Date(date);
                    var firstDate;
                    if((dateObj > new Date("2021-03-14T00:00:00.000Z") && dateObj < new Date("2021-11-07T00:00:00.000Z")) || dateObj > new Date("2022-03-13T00:00:00.000Z")){
                        firstDate = new Date(dateObj.setTime(dateObj.getTime() + (7 * 60 * 60 * 1000)));
                    }
                    else{
                        firstDate = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
                    }
                    // var dateObj = new Date(date);
                    // var firstDate = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
//                                 var firstDateUse = new Date(dateObj.setTime(dateObj.getTime() + (8 * 60 * 60 * 1000)));
                    // var newDate = new Date(date.setTime(date.getTime() + (8 * 60 * 60 * 1000)));
                    var newerDate;
                    if(package === "Standard"){
                        // console.log(newDate);
                        newerDate = new Date(dateObj.setTime(dateObj.getTime() + (1 * 60 * 60 * 1000))).toISOString();
                        // newerDate = newerDate.toISOString();
                        // console.log(newerDate);
                    }
                    else if(package === "Premium"){
                        newerDate = new Date(dateObj.setTime(dateObj.getTime() + (1.5 * 60 * 60 * 1000))).toISOString();
                    }
                    else if(package === "Exclusive"){
                        newerDate = new Date(dateObj.setTime(dateObj.getTime() + (2 * 60 * 60 * 1000))).toISOString();
                    }
                    else{
                        res.sendStatus(400)
                        return;
                    }
                    
                    var event = {
                        'summary': 'Thomas Yarnell Photoshoot',
                        'status': 'confirmed',
                        'location': location, //'409 Mockingbird Lane, Walnut, CA, USA',
                        'description': 'Category: ' + type + '\nPackage: ' + package + '\nNotes: ' + notes,
                        'start': {
                        'dateTime':  firstDate.toISOString(), // change to booking date
                        'timeZone': 'America/Los_Angeles',
                        },
                        'end': {
                        'dateTime': newerDate, // add however many hours as package is
                        'timeZone': 'America/Los_Angeles',
                        },
                        'attendees': [
                        {'email': 'thomasyarnellphotos@gmail.com', 'responseStatus': 'accepted', 'comment': 'Please arrive on time!'}, // do we need this line? p sure we do ...
                        {'email': email, 'responseStatus': 'accepted'}, // replace w/ user email
                        ],
                    };
                
                    calendar.events.update({
                        auth: auth,
                        calendarId: 'primary',
                        eventId: eventId,
                        resource: event,
                        sendUpdates: 'all'
                    }, 
                    function(err, event) {
                        if (err) {
                            console.log('There was an error contacting the Calendar service: ' + err);
                            return;
                        }
                        console.log('Event created: %s', event.data);

                        configdb
                            .updateOne({ _id: ObjectID(process.env.CONFIGDB), "used_bookings": old_date }, { $set: { "used_bookings.$" : date }})
                            .then(() => {
                                res.sendStatus(200);
                                return;
                            })
                            .catch((err) => {
                                res.sendStatus(400)
                                return;
                            });
                        
                        

                    });
                }
            });

        }
        else{
            console.log("ELSE")
            res.sendStatus(400);
        }
        // console.log(test)

    })
    .catch((err) => {
        console.log("hi")
        console.log(err)
        res.sendStatus(400);
        return;
    });

});

// delete /bookings/:id
router.delete('/bookings/:id', ensureAuthenticated, (req, res, next) => {
    // grab ids and dbs
    const id = ObjectID(req.params.id);
    const userid = ObjectID(req.user.id);
    const bookings = req.app.locals.bookings;
    const users = req.app.locals.users;
    const configdb = req.app.locals.configdb;

    var docdate;

    console.log("hi")

    // find the booking
    bookings.findOne(id)
    .then(doc => {
        // send a booking deleted email 
        console.log("hi12")
        docdate = doc.date;
        // delete the booking date from configdb global booking dates array
        // console.log(docdate)
        configdb
            .updateOne({ _id: ObjectID(process.env.CONFIGDB) }, { $pull: { used_bookings: docdate }})
            .then(() => {
                // console.log(docdate)
                console.log("test")
                const link = "https://" + req.get('host') + "/bookings";
                
                var urlLocation = doc.location.replace(" ", "+");
                const staticMapLink = "https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C" + urlLocation + "&key=" + process.env.MAPAPI;  
                
                const driving = "https://www.google.com/maps/dir/?api=1&destination=" + urlLocation + "&travelmode:driving&dir_action:navigate";
    
                // const streetView = "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" + lat + "," + long + "&fov=100";
    
                console.log(driving)
                // console.log(streetView)
                console.log(staticMapLink)

                // const output = `
                // <p>Thomas Yarnell Photography Delete Bookings</p>
                // <h3>Deleted Booking Details</h3>
                // <ul>  
                //     <li>Name: ${doc.first_name}  ${doc.last_name}</li>
                //     <li>Email: ${doc.email}</li>
                //     <li>Phone: ${doc.phone_num}</li>
                //     <li>Location: ${doc.location}</li>
                //     <li>Date: ${new Date(doc.date).toLocaleString('en-US')}</li>
                //     <li>Type: ${doc.type}</li>
                //     <li>Package: ${doc.package}</li>
                //     <li>Notes: ${doc.notes}</li>
                // </ul>
                // <h3>Click this <a href=${link}>link</a> to create a new appointment</h3>
                // `;
                
                const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
                                        <h1 style="font-size: 24px; margin: 0;">Deleted Booking</h1>
                                    </td>
                                </tr>
                        <tr>
                                    <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                                <p style="margin: 0;">Hi ${doc.first_name},<br></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                                <p style="margin: 0;">We're sorry you had to cancel your appointment. Here are your deleted booking details: </p>
                                    </td>
                                </tr>
                        <tr>
                        <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 5px 0 5px 0;">
                            <ul style="list-style-type: none; line-height: 28px;">  
                                <li><strong>Name</strong>: ${doc.first_name}  ${doc.last_name}</li>
                                <li><strong>Email</strong>: ${doc.email}</li>
                                <li><strong>Phone</strong>: ${doc.phone_num}</li>
                                <li><strong>Location</strong>: <a href="${driving}" style="color: inherit">${doc.location.substring(0, doc.location.indexOf(","))}</a>${doc.location.substring(doc.location.indexOf(","), doc.location.length)}</li>
                                <li><strong>Date</strong>: ${new Date(doc.date).toLocaleString('en-US')} PDT</li>
                                <li><strong>Category</strong>: ${doc.type}</li>
                                <li><strong>Package</strong>: ${doc.package}</li>
                                <li><strong>Notes</strong>: ${doc.notes}</li>
                            </ul>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <a href="${"https://www.google.com/maps/place/" + urlLocation}"><img style="height: 400px; width: 600px;" src="https://maps.googleapis.com/maps/api/staticmap?&maptype=hybrid&size=600x400&markers=color:red%7C4141+Nogales%20Street,%20West%20Covina,%20CA,%20USA&zoom=18&key=AIzaSyAXnO5_29oeGqNIchVstCYS29QCI-wBJ0Q"></a>
                        </td>
                        </tr>
                        <tr>
                                    <td style="color: #153643; font-family: Arial; font-size: 16px; line-height: 24px; padding: 20px 0 5px 0;">
                            <p style="margin: 0;">Click <a style="color: inherit" href="${link}">here</a> to create a new booking.</p>
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
                </html>`;

                const options = {
                    from: "thomasyarnellphotos@gmail.com",
                    to: doc.email,
                    subject: "Thomas Yarnell Photography | Deleted Booking",
                    html: output
                };

                transporter.sendMail(options, function (err, info) {
                    if (err) {
                        res.sendStatus(400)
                        return;
                    }
        
                    // send email w/ booking info
                    // fs.readFile('./credentials.json', (err, content) => {
                        // if(err){
                            // return console.log('Error loading client secret file: ', err);
                        // }
                        authorize(/*JSON.parse(content),*/ editEvents)
                    // });
        
                    function editEvents(auth) {
                        const calendar = google.calendar({version: 'v3', auth});
                    
                        calendar.events.delete({
                            auth: auth,
                            calendarId: 'primary',
                            eventId: doc.eventId,
                            sendUpdates: 'all'
                        }, 
                        function(err, event) {
                            if (err) {
                                console.log('There was an error contacting the Calendar service: ' + err);
                                return;
                            }
                            console.log('Event created: %s', event.data);
                            // delete the bookingid from users booking array
                            users
                            .updateOne({ _id: userid }, { $pull: { bookings: id }})
                            .then(() => {
                                // delete the booking from bookings db
                                bookings
                                .deleteOne({ _id: id })
                                .then(() => {
                                    res.sendStatus(200)
                                })
                                .catch((err) => {
                                    // req.flash('error', 'We could not delete the booking');
                                    res.sendStatus(400)
                                })
                            })
                            .catch((err) => {
                                // req.flash('error', 'We could not delete the users booking');
                                res.sendStatus(400)
                            })
                        });
                    }
        
                });
            })
            .catch((err) => {
                // req.flash('error', 'We could not delete the configdb booking');
                console.log(err)
                res.sendStatus(400)
            })
    })
    .catch(err => {
        // req.flash('error', 'Error deleting booking');
        res.sendStatus(400)
    })

});

module.exports = router;