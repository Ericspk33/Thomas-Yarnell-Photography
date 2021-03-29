// basic imports
var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const dotenv = require('dotenv');
dotenv.config();

// ensures users is logged in, or sends a 401 status
const ensureAuthenticated = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }
    
  res.sendStatus(401)
};

// post /shop
    // takes url, price, quantity as prerequisites
router.post('/shop', ensureAuthenticated, (req, res, next) => {
    
    // grab userinfo, url, price, quantity, and dbs 
    const users = req.app.locals.users;
    const user_id = req.user.id;
    const url = req.body.id;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const size = req.body.size;
    console.log(req.body)

    users.findOne({ _id: ObjectID(user_id) })
    .then((doc) => {
        var cart = doc.cart;

        if(quantity == 0){
            const oldSize = req.body.oldSize;
            for(var i = 0; i < cart.length; i++){
                if(cart[i].url === url && cart[i].size == req.body.oldSize){
                    cart[i].size = size;
                    console.log(price)
                    console.log(cart[i].price)
                    cart[i].price = price; //(req.body.oldSize-size == -1) ? (size == 2 ? (price / 1.4 * 2) : size == 1 ? price / 1.2 * 1.4 : price * 1.2) : (size == 3 ? (price / 2 * 1.4) : size === 2 ? price / 1.4 * 1.2 : price / 1.2); 
                    console.log("price: " + cart[i].price)

                    for(var j = 0; j < cart.length; j++){
                        if(cart[j].url === url && cart[j].size == size && j != i){
                            
                            cart[i].quantity += cart[j].quantity;
                            cart[i].quantity = Math.min(cart[i].quantity, 10);
                            // cart[i].size = size;

                            cart.splice(j, 1);
                            break;
                        }
                    }

                    break;
                }
            }

            users.updateOne({ _id: ObjectID(user_id)}, { $set: { "cart": cart }})
            .then(() => {
                res.sendStatus(200);
            })
            .catch((err) => {
                res.sendStatus(400);
            })

            
        }
        else{
            for(var obj in doc.cart){

                if(doc.cart[obj].url === url && doc.cart[obj].size == size){
                    var cartobjquant = parseInt(doc.cart[obj].quantity, 10);
                    users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${obj}.quantity`]: (Math.min(cartobjquant+ parseInt(quantity), 10)), [`cart.${obj}.price`]: price, [`cart.${obj}.size`]: size }})
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch((err) => {
                        // req.flash('error', 'Error updating cart info');
                        res.sendStatus(400);
                    });
                    return;
                }

            }
            
            // if not, add it
            users
                .updateOne({ _id: ObjectID(user_id) }, { $push: { cart: { size, url, price, "quantity": Math.min(parseInt(quantity), 10) }}})
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((err) => {
                    // req.flash('error', 'We could not update the cart');
                    res.sendStatus(400);
                });
        }

    })
    .catch((err) => {
        console.log("poo: " + err)
    })
    // users.findOne({ _id: ObjectID(user_id)})
    // .then((doc) => {
    //     // console.log(doc);
    //     console.log("0")
    //     // quantity is 0
    //     if(quantity === 0){
    //         console.log("1")
    //         var nohits = true;
    //         var counter = 0;
    //         for(var index = 0; index < doc.cart.length; index++){
    //             var curr = doc.cart[index];
    //             // console.log(index + " element is " + curr.url + " | " + curr.size)
    //             // console.log(curr.url === url)
    //             // console.log(curr.size + " | " + req.body.oldSize)
    //             // console.log(curr.size == req.body.oldSize)
    //             console.log("2 rpt")
    //             if(curr.url === url && curr.size == req.body.oldSize){ // url is the same, and the size is the old same
    //                 // console.log("hi")
    //                 var bool = true;
    //                 console.log("3")
    //                 users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${index}.size`]: size, [`cart.${index}.price`]: price } })
    //                 .then(() => {
    //                     bool = false;
    //                     console.log("4")
    //                     for(var index1 = 0; index1 < doc.cart.length; index1++){
    //                         var curr1 = doc.cart[index1];
    //                         // console.log(doc.cart[index1].url)
    //                         // console.log(doc.cart[index1].size)
    //                         console.log("5 rpt")
    //                         if(curr.url === url && curr.size == size && index1 != index){
    //                             // console.log("GOT HIT!!!")
    //                             // console.log(index1 + " : " + index)
    //                             // we want to keep the first one (curr)
    //                             // merge the quant of 2nd (this one) w/ curr
    //                             // delete the second one
    //                             console.log("6")
    //                             nohits = false;
    //                             var uq = parseInt(curr1.quantity, 10) + parseInt(curr.quantity, 10);
    //                             uq = Math.min(uq, 10);
    //                             // console.log("uq: " + uq)
    //                             users.updateOne({ _id: ObjectID(user_id)}, { $set: { [`cart.${index}.quantity`]: uq }})
    //                             .then(() => {

    //                                 console.log("7")
    //                                 users.updateOne({ _id: ObjectID(user_id) }, { $unset : { [`cart.${index1}`]: 1 }}).then(() => {
    //                                     users.updateOne({ _id: ObjectID(user_id) }, { $pull: { "cart" : null }}).then(() => {
    //                                         // console.log("i pulled em out")
    //                                         console.log("8")
    //                                         res.sendStatus(200);
    //                                     })
    //                                     .catch((err) => {
    //                                         console.log(err);
    //                                         res.sendStatus(400)
    //                                     })
    //                                 })


    //                             })
    //                             .catch((err) => {
    //                                 // console.log(err)
    //                             })
    //                         }
    //                         else{
    //                             // console.log("DIDNDT GET HIT DUMBO 2")
    //                             // res.sendStatus(200);
    //                             counter++;
    //                         }
    //                         console.log("woo")
    //                     }

                        

                        
    //                     console.log("hi")
    //                 })
    //                 .catch((err) => {
    //                     // console.log(err)
    //                 })
    //                 // while(bool){

    //                 // }
    //                 console.log("jhere")
    //                 counter++;
    //             }
    //             else{
    //                 // console.log("DIDNT GET HIT DUMBO")
    //                 counter++;
    //                 console.log("acs: " + counter)
    //             }
    //         }
    //         while(counter < doc.cart.length){
                
    //         }
            
    //         console.log("very bottom")
    //         // res.sendStatus(200);
    //     }
    //     else{


    //         for(var obj in doc.cart){

    //             if(doc.cart[obj].url === url && doc.cart[obj].size == size){
    //                 var cartobjquant = parseInt(doc.cart[obj].quantity, 10);
    //                 users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${obj}.quantity`]: (Math.min(cartobjquant+ parseInt(quantity), 10)), [`cart.${obj}.price`]: price, [`cart.${obj}.size`]: size }})
    //                 .then(() => {
    //                     res.sendStatus(200);
    //                 })
    //                 .catch((err) => {
    //                     // req.flash('error', 'Error updating cart info');
    //                     res.sendStatus(400);
    //                 });
    //                 return;
    //             }

    //         }
            
    //         // if not, add it
    //         users
    //             .updateOne({ _id: ObjectID(user_id) }, { $push: { cart: { size, url, price, "quantity": Math.min(parseInt(quantity), 10) }}})
    //             .then(() => {
    //                 res.sendStatus(200);
    //             })
    //             .catch((err) => {
    //                 // req.flash('error', 'We could not update the cart');
    //                 res.sendStatus(400);
    //             });


    //     }


    // })
    // .catch((err) => {
    //     console.log(err);
    //     res.sendStatus(400);
    // })
    // res.sendStatus(200);

    // if(quantity === 0){
    //     const old_size = req.body.oldSize;
        
    //     console.log(req.body);
    //     console.log(url)
    //     console.log(price)
    //     console.log(quantity)
    //     console.log(size)

    //     users.findOne({ _id: ObjectID(user_id) })
    //     .then(doc => {
    //         // loop through everything in the cart to check if the item is already in there
    //         var once = false;
    //         var first = -1;
    //         for(var obj in doc.cart){
    //             console.log(obj)
    //             if(doc.cart[obj].url === url && doc.cart[obj].size === old_size){
    //                 // console.log(doc.cart)
    //                 console.log("here")
    //                 if(!once){
    //                     console.log("first once: " + once + " | " + obj)
    //                     once = true;
    //                     first = obj;
    //                     var cartobjquant = parseInt(doc.cart[obj].quantity, 10);
    //                     users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${obj}.quantity`]: (Math.min(cartobjquant+ parseInt(quantity), 10)), [`cart.${obj}.price`]: price, [`cart.${obj}.size`]: size }})
    //                     .then(() => {
    //                         // res.sendStatus(200);
    //                         console.log("hi")
                            
    //                     })
    //                     .catch((err) => {
    //                         // req.flash('error', 'Error updating cart info');
    //                         res.sendStatus(400);
    //                     });
    //                     // console.log(doc.cart)
    //                     console.log("hoef")
    //                 }
    //                 // else{
    //                 //     console.log(first);
    //                 //     console.log(doc)
    //                 //     var cartobjquant = parseInt(doc.cart[obj].quantity, 10);
    //                 //     users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${first}.quantity`]: (Math.min(parseInt(doc.cart[first].quantity, 10) + cartobjquant, 10))}})
    //                 //     .then(() => {
    //                 //         users.updateOne({ _id: ObjectID(user_id) }, { $unset : { [`cart.${obj}`]: 1 }})
    //                 //         users.updateOne({ _id: ObjectID(user_id) }, { $pull: { "cart" : null }})
    //                 //         res.sendStatus(200);
    //                 //     })
    //                 //     .catch((err) => {
    //                 //         res.sendStatus(400);
    //                 //     });
    //                 //     return;
    //                 // }
    //             }
    //             else if(doc.cart[obj].url === url && doc.cart[obj].size === size){
    //                 console.log("hi2")
    //                 // console.log(first);
    //                 // console.log(doc.cart)
    //                 cartobjquant = parseInt(doc.cart[obj].quantity, 10);
                    
    //                 console.log(" ")
    //                 console.log(" ")
    //                 console.log("first: " + first);
    //                 console.log("obj: " + obj)
    //                 console.log("cart: " + doc.cart)
    //                 console.log("doc.cart[obj].quantity: " + doc.cart[obj].quantity)
    //                 console.log("doc.cart[first].quantity: " + doc.cart[first].quantity)
    //                 console.log("cartobjquanty: " + cartobjquant)
    //                 console.log(Math.min((parseInt(doc.cart[first].quantity) + cartobjquant), 0))

    //                 users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${first}.quantity`]: (Math.min((parseInt(doc.cart[first].quantity) + cartobjquant), 10))}})
    //                 .then(() => {
    //                     users.updateOne({ _id: ObjectID(user_id) }, { $unset : { [`cart.${obj}`]: 1 }}).then(() => {
    //                         users.updateOne({ _id: ObjectID(user_id) }, { $pull: { "cart" : null }})
    //                     })
    //                     res.sendStatus(200);
    //                 })
    //                 .catch((err) => {
    //                     res.sendStatus(400);
    //                 });
    //                 return;
    //             }

    //             console.log("bottom")
    //         }        
    //     })
    //     .catch(err => {
    //         // req.flash('error', 'We could not update the cart')
    //         res.sendStatus(400);
    //     });

    //     // res.sendStatus(200);
    //     // return;
    // }
    // else{
    //     // insert info into shop (cart)
    //     users.findOne({ _id: ObjectID(user_id) })
    //     .then(doc => {
    //         // loop through everything in the cart to check if the item is already in there
    //         for(var obj in doc.cart){
    //             if(doc.cart[obj].url === url && doc.cart[obj].size === size){
    //                 var cartobjquant = parseInt(doc.cart[obj].quantity, 10);
    //                 users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${obj}.quantity`]: (Math.min(cartobjquant+ parseInt(quantity), 10)), [`cart.${obj}.price`]: price, [`cart.${obj}.size`]: size }})
    //                 .then(() => {
    //                     res.sendStatus(200);
    //                 })
    //                 .catch((err) => {
    //                     // req.flash('error', 'Error updating cart info');
    //                     res.sendStatus(400);
    //                 });
    //                 return;
    //             }
    //         }
            
    //         // if not, add it
    //         users
    //             .updateOne({ _id: ObjectID(user_id) }, { $push: { cart: { size, url, price, "quantity": Math.min(parseInt(quantity), 10) }}})
    //             .then(() => {
    //                 res.sendStatus(200);
    //             })
    //             .catch((err) => {
    //                 // req.flash('error', 'We could not update the cart');
    //                 res.sendStatus(400);
    //             });
            
    //     })
    //     .catch(err => {
    //         // req.flash('error', 'We could not update the cart')
    //         res.sendStatus(400);
    //     });
    // }

    

});

// delete /shop
    // takes url and quantity as prerequisites
router.delete('/shop', ensureAuthenticated, (req, res, next) => {

    // basic user info and url and quantity
    const users = req.app.locals.users;
    const user_id = req.user.id;
    const url = req.body.id;
    const quantity = req.body.quantity;
    const size = req.body.size;

    console.log(req.body)
    console.log(url + " : " + quantity + " : " + size);

    // find the item in the cart
    users.findOne({ _id: ObjectID(user_id) })
        .then(doc => {
            console.log(doc);
            // loop through the cart to check the url
            for(var obj in doc.cart){
                // check the url (item) and remove the quantity
                console.log(obj)
                console.log(doc.cart[obj])
                if(doc.cart[obj].url == url && (size == 6 || doc.cart[obj].size == size)){
                    console.log(doc.cart[obj])
                    var cartobjquant = parseInt(doc.cart[obj].quantity, 10) - parseInt(quantity);
                    // if cartobjquant is negative or 0, remove it
                    if(cartobjquant <= 0){
                        if(size == 6){
                            users.updateOne({ _id: ObjectID(user_id)}, { $pull: { "cart": {"url": url }}})
                            .then(() => {
                                res.sendStatus(200);
                            })
                            .catch((err) => {
                                res.sendStatus(400);
                            });
                            return;
                        }
                        else{
                            users.updateOne({ _id: ObjectID(user_id)}, { $pull: { "cart": { "url": url, "size": size }}})
                            .then(() => {
                                res.sendStatus(200);
                            })
                            .catch((err) => {
                                // req.flash('error', 'Error updating cart info');
                                res.sendStatus(400);
                            });
                            return;
                        }
                    }

                    // if cartobjquant isnt negative, then update it
                    users.updateOne({ _id: ObjectID(user_id) }, { $set: { [`cart.${obj}.quantity`]: (cartobjquant) }})
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch((err) => {
                        // req.flash('error', 'Error updating cart info');
                        res.sendStatus(400)
                    });
                    return;
                }

            }
        })
        .catch(err => {
            // req.flash('error', 'We could not update the cart')`
            res.sendStatus(400);
        });

});

module.exports = router;