const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({ //creating schema for the new posts created by user in the app
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String, //photo URL
        required: true
    },
    likes: [{
        type: ObjectId, //referring to the User model 
        ref: "User"
    }],
    comments: [{
        text: String, // comment text is of type string
        postedBy: { type: ObjectId, ref: "User" }
    }],

    postedBy: {
        type: ObjectId, //referring to the User model 
        ref: "User"
    }

}, { timestamps: true })

mongoose.model("Post", postSchema)