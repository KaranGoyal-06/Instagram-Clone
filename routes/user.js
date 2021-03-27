const express = require('express')
const router = express.Router() //if not working in app.js then we need to use router
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin') // importing middleware
const User = mongoose.model("User")
const Post = mongoose.model("Post")


router.get('/profile/:id', requireLogin, (req, res) => { //route for finding the profile of other user by sending user id in params
    User.findOne({ _id: req.params.id }) //finding the user with user id passed in params, User refers to the user model
        .select("-password")//we don't want other user's password, so preventing it
        .then(user => {//if user is found
            Post.find({ postedBy: req.params.id }) //finding the posts created by that user by passed id in params
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) { //if didn't found the posts
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts }) //if posts are found, then responding with user and posts details
                })
        }).catch(err => { //if user is not found
            return res.status(404).json({ error: "User not found" })
        })
})


router.put('/follow', requireLogin, (req, res) => { //route for following the other user
    User.findByIdAndUpdate(req.body.followId, { //finding the user which is to be followed by passing the Id, the id will be passed from frontend
        $push: { followers: req.user._id } //pushing the id of the logged in user who wants to follow the other user, in the followers array of user which is to be followed
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })//will implement if there is error
        }
        User.findByIdAndUpdate(req.user._id, { //and if there is no error, then we will update the following array of the logged in user who just followed the other user
            $push: { following: req.body.followId } //pushing the id of the followed user in the following array of the user who is following 
        }, {
            new: true
        }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})


router.put('/unfollow', requireLogin, (req, res) => { //route for unfollowing the other user
    User.findByIdAndUpdate(req.body.unfollowId, { //finding the user which is to be unfollowed by passing the Id, the id will be passed from frontend
        $pull: { followers: req.user._id } //pulling the id of the logged in user who wants to  unfollow the other user, from the followers array of user which is to be unfollowed
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })//will implement if there is error
        }
        User.findByIdAndUpdate(req.user._id, { //and if there is no error, then we will update the following array of the logged in user who just unfollowed the other user
            $pull: { following: req.body.unfollowId } //pulling the id of the unfollowed user from the following array of the user who is unfollowing 
        }, {
            new: true
        }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})


router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "Photo cannot be uploaded" })
            }
            res.json(result)
        })
})





module.exports = router