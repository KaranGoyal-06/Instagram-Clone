const express = require('express')
const router = express.Router() //if not working in app.js then we need to use router
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs') // npm package to hide the password in database, you can install it by npm i bcryptjs
const jwt = require('jsonwebtoken') //requiring the json web token it is used to create a token as soon as user is signed in, so that he can use the protected resources, you can install it -> npm i jsonwebtoken
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin') // requiring the middleware
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API, EMAIL } = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))


router.post('/signup', (req, res) => { //creating a signup route for the new user
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" })
    }
    User.findOne({ email: email }) //Searching that user exists in our database or not
        .then((savedUser) => {
            if (savedUser) { // if control is coming here that means user exists in our database
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12) // basically encrypting the password in the database
                .then(hashedpassword => {
                    const user = new User({ //if the user doesn't exist than creating a new model and saving it
                        email: email,
                        password: hashedpassword,
                        name: name,
                        pic: pic
                    })

                    user.save() // saving the model to database
                        .then(user => {
                            transporter.sendMail({ //process for sending mail on successfully signing up using sendgrit
                                to: user.email,
                                from: "karangoyal989@gmail.com",
                                subject: "Signup Success",
                                html: "<div><h3>Dear User, </h3><h1>Welcome To My Instagram Clone</h1><h3>You have successfully signed up. Please sign in to experience the application.</h3></div>"
                            })
                            res.json({ message: "Signed Up Successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })


        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/signin', (req, res) => { // creating a signin route for the existing user
    const { email, password } = req.body // destructuring entities provided by the user
    if (!email || !password) { // if the user didn't input either email or password
        return res.status(422).json({ error: "Please add email or password " })
    }
    User.findOne({ email: email }) //finding the user email in database
        .then(savedUser => { //savedUser will contain all the details of the user i.e name, email,_id etc
            if (!savedUser) { // if didn't found the user's email in database
                return res.status(422).json({ error: "Invalid email or password " })
            }
            bcrypt.compare(password, savedUser.password) // basically comparing the password input by the user to the saved passsword in the database, 1st arguement is user input and 2nd arg is saved password in the database, it returns a boolean value
                .then(doMatch => {
                    if (doMatch) { // if password matches i.e. bcrypt.compare returns a true value
                        // res.json({ message: "Successfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET) //generating a token using jwt.sign method, in 1st arguement we are paasing the saved id in database to the _id variable, and in the second arguement we are passing the key created
                        const { _id, name, email, followers, following, pic } = savedUser //destructuring the user details from savedUser
                        res.json({ token: token, user: { _id, name, email, followers, following, pic } }) //passing the generated token and user details as json data when user successfully signed in
                    }
                    else { // if password doesn't match
                        return res.status(422).json({ error: "Invalid email or password " })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })

})

router.post('/reset-password', (req, res) => { //route for resetting password
    crypto.randomBytes(32, (err, buffer) => {//generating a token
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })//finding the user with the email entered by him in Reset.js
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User not exists with this email" })
                }
                user.resetToken = token//setting token
                user.expireToken = Date.now() + 3600000 //token will be available for 1 hour i.e 3600000ms
                user.save().then((result) => {//sending the mail,  on clicking the link below in the mail, the user will redirect to Newpassword.js page with the token in the url
                    transporter.sendMail({
                        to: user.email,
                        from: "karangoyal989@gmail.com",
                        subject: "Password Reset",
                        html: `
                            <p>You have requested for Password reset</p>
                            <h5>Click on this <a href="${EMAIL}/reset/${token}">Link</a> to reset your password.</h5>
                            `
                    })
                    res.json({ message: "Check Your Email" })
                })
            })
    })
})

router.post('/new-password', (req, res) => {//route for setting the new password
    const newPassword = req.body.password //saving the new password
    const sentToken = req.body.token// saving the token 
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })//finding the user with sent token
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try Again Session Expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => { //hashing the new password and saving it in database
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then((savedUser) => {
                    res.json({ message: "Password Updated Success" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})


module.exports = router