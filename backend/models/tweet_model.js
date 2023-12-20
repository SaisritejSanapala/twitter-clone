const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tweetedBy: {
        type: ObjectId,
        ref: "User"
    },
    likes: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            content: String,
            commentedBy: { type: ObjectId, ref: "User" },
            commentedAt: { type: Date, default: Date.now, }
        }
    ],
    reTweetedBy: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    image: {
        type: String,
        default: ""
    },
    replies: [
        {
            type: ObjectId,
            ref: "Tweet"
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
    ,
    type: {
        type: String,
        default: "tweet"
    }
})

mongoose.model("Tweet", tweetSchema)