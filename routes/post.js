const express = require('express')
const router = express.Router() //if not working in app.js then we need to use router
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin') // importing middleware
const Post = mongoose.model("Post")

router.get('/allpost', requireLogin, (req, res) => { //route for showing all posts i.e Home Page
    Post.find() //finding all posts using Post model
        .populate('postedBy', '_id name') //populating the postedBy on populating it will show all the details like name, emali, password and id when requested is made but we only want name and _id to be shown that's why we are passing these two in the second arguement
        .populate('comments.postedBy', '_id name')//also populating the comments array
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts: posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/mypost', requireLogin, (req, res) => { //route for showing all posts created by a signed in user & also passing the middleware requireLogin because then only we will able to access req.user._id used in next line of code.
    Post.find({ postedBy: req.user._id }) //finding the posts in which the _id is of the signed in user's.
        .populate('postedBy', '_id name')
        .then(myposts => {
            res.json({ mypost: myposts }) //showing all the posts  created by a signed in user
        })
        .catch(err => {
            console.log(err)
        })
})


router.get('/getsubpost', requireLogin, (req, res) => { //route for showing all the posts of the users, the logged in user is following 
    Post.find({ postedBy: { $in: req.user.following } }) // finding the posts where the postedBy comes in the following array 
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/createpost', requireLogin, (req, res) => { // route for creating a post when user is signed in
    const { title, body, pic } = req.body //destructuring title, body and the url of the pic uploaded by the client
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    req.user.password = undefined //the post model created below will also show the user's password, so we are preventing it by making password undefined
    const post = new Post({
        title: title, //capturing the values of title, body, pic's url input by user in post model
        body: body,
        photo: pic, //saving the photo url to photo key as per our schema
        postedBy: req.user //req.user will contain name, email, password of the user, we defined it in the middleware

    })
    post.save().then(result => { // saving the post  to the mongo database
        res.json({ post: result }) // the result will contain all the details of the post like title, body, user's name, email, password
    })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => { //route to send a put request everytime a user likes a post, put request is used for updating purpose
    Post.findByIdAndUpdate(req.body.postId, { // finding the post in the Post model using the post id that will be passed from the front end 
        $push: { likes: req.user._id } //after finding the post we will update likes array by pushing the user id of the logged in user everytime a post is liked
    }, {
        new: true //we are adding this so that mongo db will send the updated record everytime a user likes post
    }).populate('postedBy', '_id name') //also populating the post postedBy
        .populate("comments.postedBy", "_id name") //populating the comments postedBy on populating it will show all the details like name, emali, password and id when requested is made but we only want name and _id to be shown that's why we are passing these two in the second arguement
        .exec((err, result) => { //executing the findByIdAndUpdate query results
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put('/unlike', requireLogin, (req, res) => { //route to send a put request everytime a user unlikes a post, put request is used for updating purpose
    Post.findByIdAndUpdate(req.body.postId, { // finding the post in the Post model using the post id that will be passed from the front end 
        $pull: { likes: req.user._id } //after finding the post we will update likes array by pulling the user id of the logged in user everytime a post is unliked
    }, {
        new: true //we are adding this so that mongo db will send the updated record everytime a user likes post
    }).populate('postedBy', '_id name') //also populating the post postedBy
        .populate("comments.postedBy", "_id name")//populating the comments postedBy on populating it will show all the details like name, emali, password and id when requested is made but we only want name and _id to be shown that's why we are passing these two in the second arguement
        .exec((err, result) => { //executing the findByIdAndUpdate query results
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put('/comment', requireLogin, (req, res) => { //route to send a put request everytime a user makes a comment, put request is used for updating purpose
    const comment = {
        text: req.body.text, //this will be passed by the user in the frontend
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, { // finding the post in the Post model using the post id that will be passed from the front end 
        $push: { comments: comment } //after finding the post we will update comments array by pushing the comment object of the logged in user everytime a comment is made
    }, {
        new: true //we are adding this so that mongo db will send the updated record everytime a user comments on a post
    })
        .populate("comments.postedBy", "_id name") //populating the comments postedBy on populating it will show all the details like name, emali, password and id when requested is made but we only want name and _id to be shown that's why we are passing these two in the second arguement
        .populate('postedBy', '_id name') //also populating the post postedBy
        .exec((err, result) => { //executing the findByIdAndUpdate query results
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => { //route for deleting the post by sending delete request with postId as params
    Post.findOne({ _id: req.params.postId }) //finding the post by the id passed in the params 
        .populate('postedBy', '_id name')
        .exec((err, post) => {
            if (err || !post) { //will implement if error or post is not present
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) { //logic for, only the user who has created a post can delete it also converting the id's into string
                post.remove() //will remove the post from database not from client UI
                    .then(result => {
                        res.json(result)//will return the deleted post
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})


module.exports = router