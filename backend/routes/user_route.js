const express = require('express');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Tweet = mongoose.model("Tweet");

const { JWT_SECRET } = require('../config');
const protectedRoute = require('../middleware/protectedResource')


router.post("/API/auth/register", (req, res) => {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    User.findOne({ email: email })
        .then((userInDB) => {

            if (userInDB) {
                return res.status(500).json({ error: "User with this email already registered" });
            }

            User.findOne({ username: username })
                .then((userInDB) => {
                    if (userInDB) {
                        return res.status(500).json({ error: "User with this username already registered" });
                    }
                    bcryptjs.hash(password, 16)
                        .then((hashedPassword) => {
                            const user = new User({ name, email, username: username, password: hashedPassword });
                            user.save()
                                .then((newUser) => {
                                    res.status(201).json({ result: "User Signed up Successfully!" });
                                })
                                .catch((error) => {
                                    console.log(err);
                                })
                        }).catch((err) => {
                            console.log(err);
                        })

                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post("/API/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (!password || !username) {
        return res.status(400).json({ error: "One or more mandatory fields are empty" });
    }
    User.findOne({ username: username })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ error: "Invalid Credentials" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id, "name": userInDB.name, "email": userInDB.email, "username": userInDB.username, "profilePicture": userInDB.profilePicture };
                        res.status(200).json({ result: { token: jwtToken, user: userInfo } });
                    } else {
                        return res.status(401).json({ error: "Invalid Credentials" });
                    }
                }).catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
});



router.get('/API/user/:id', (req, res) => {
    User.findOne({ _id: req.params.id })

        .then((user) => {
            user.password = undefined
            res.json({ user: user })
        })
        .catch((err) => {
            res.json({ err: err })
        })
})



router.post('/API/user/:id/follow', protectedRoute, (req, res) => {
    const id = req.params.id
    if (id == req.user._id) {
        return res.json({ "error": "cannot follow yourself" })
    }

    User.findOne({ _id: id })
        .then((isFound) => {
            if (isFound.followers.includes(req.user._id)) {
                return res.status(500).json(({ "error": "Can't follow a user that you're already following" }))
            }

            User.findByIdAndUpdate({ _id: id }, {
                $push: { followers: req.user._id }
            }, {
                new: true //returns updated record
            })
                .then(() => {
                    User.findByIdAndUpdate({ _id: req.user._id }, {
                        $push: { following: id }
                    }, {
                        new: true //returns updated record
                    })
                        .then((user) => {
                            res.status(200).json({ "success": true })
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                })
                .catch((err) => console.log(err))
        })
        .catch((err) => { res.status(500).json({ err: err }) })


})

router.post('/API/user/:id/unfollow', protectedRoute, (req, res) => {
    const id = req.params.id
    if (id == req.user._id) {
        return res.status(500).json({ "error": "cannot unfollow yourself" })
    }


    User.findOne({ _id: id })
        .then((isFound) => {

            if (isFound.followers.includes(req.user._id)) {
                User.findByIdAndUpdate({ _id: id }, {
                    $pull: { followers: req.user._id }
                }, {
                    new: true //returns updated record
                })
                    .then(() => {
                        User.findByIdAndUpdate({ _id: req.user._id }, {
                            $pull: { following: id }
                        }, {
                            new: true //returns updated record
                        })
                            .then((user) => {
                                res.status(200).json({ "success": true })
                            })
                            .catch((err) => {
                                res.status(500).json({ err: err })
                            })

                    })
                    .catch((err) => console.log(err))

            } else {
                return res.status(500).json(({ "error": "Can't unfollow a user that you're not following" }))
            }
        })
        .catch((err) => { console.log(err) })
})

router.put('/API/user/:id/', protectedRoute, (req, res) => {
    const { name, dateOfBirth, location } = req.body
    User.findByIdAndUpdate({ _id: req.user._id }, {
        name: name, dateOfBirth: dateOfBirth, location: location
    })
        .then(() => { res.status(200).json({ "success": true }) })
        .catch((err) => { res.status(500).json({ err: err }) })
})


router.post('/API/user/:id/tweets', (req, res) => {
    Tweet.find({ tweetedBy: req.params.id })
        .populate("tweetedBy", "username profilePicture name")
        .populate("reTweetedBy", "username profilePicture name")
        .then((tweets) => { res.status(200).json({ "tweets": tweets }) })
        .catch((err) => { res.status(500).json({ err: err }) })
})


router.post('/API/user/:id/uploadProfilePic', protectedRoute, (req, res) => {
    const { img } = req.body
    User.findByIdAndUpdate({ _id: req.params.id }, {
        profilePicture: img
    })
        .then((result) => { res.status(200).json({ "result": result }) })
        .catch((err) => { res.status(500).json({ err: err }) })
})


module.exports = router;