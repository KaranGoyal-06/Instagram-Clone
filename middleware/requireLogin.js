const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")


module.exports = (req, res, next) => {
    //authorization header will look like authorization === Bearer epfjijjfpjfpj(token)
    const { authorization } = req.headers //destructuring the authorization header, we pass it after logging in to access the protected routes, it will contain the token
    if (!authorization) { // if authorization header not present
        return res.status(401).json({ error: "you must be logged in" })
    }
    const token = authorization.split(' ')[1] //splitting the token from the authorization header i.e. chopping the Bearer and saving the token to token variable
    jwt.verify(token, JWT_SECRET, (err, payload) => { // verifying the json token passed 
        if (err) { // if verification fails
            return res.status(401).json({ error: "you must be logged in" })
        }

        const { _id } = payload // if verification passed accessing the user details that will be in payload
        User.findById(_id).then(userdata => { //accessing user model
            req.user = userdata
            next()
        })

    })
}