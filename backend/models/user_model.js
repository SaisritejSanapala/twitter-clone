const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    location: {
        type: String

    },
    dateOfBirth: {
        type: Date

    },
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }],

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

mongoose.model("User", userSchema)