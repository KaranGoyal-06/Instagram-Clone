const express = require('express')
const router = express.Router() //if not working in app.js then we need to use router
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs') // npm package to hide the password in database, you can install it by npm i bcryptjs
const jwt = require('jsonwebtoken') //requiring the json web token it is used to create a token as soon as user is signed in, so that he can use the protected resources, you can install it -> npm i jsonwebtoken
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin') // requiring the middleware




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
                        .then(users => {
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


module.exports = router