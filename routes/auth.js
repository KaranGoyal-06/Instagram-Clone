const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API, EMAIL } = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))


router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email: email,
                        password: hashedpassword,
                        name: name,
                        pic: pic
                    })

                    user.save()
                        .then(user => {
                            transporter.sendMail({
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


router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password " })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password " })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {

                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token: token, user: { _id, name, email, followers, following, pic } })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid email or password " })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })

})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User not exists with this email" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
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

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try Again Session Expired" })
            }
            bcrypt.hash(newPassword, 12).then(hashedpassword => {
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