const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Tweet = mongoose.model("Tweet");
const protectedRoute = require('../middleware/protectedResource')

router.post('/Api/tweet', protectedRoute, (req, res) => {
    const { content, image } = req.body
    if (image === "") {
        const tweetObj = new Tweet({ content, tweetedBy: req.user._id })
        tweetObj.save()
            .then((newTweet) => { res.status(200).json({ tweet: newTweet }) })
            .catch((err) => { res.json({ err: err }) })

    } else {
        const tweetObj = new Tweet({ content, image, tweetedBy: req.user._id })
        tweetObj.save()
            .then((newTweet) => { res.status(200).json({ tweet: newTweet }) })
            .catch((err) => { res.status(500).json({ err: err }) })
    }

})


router.post('/Api/tweet/:id/like', protectedRoute, (req, res) => {
    const id = req.params.id

    Tweet.findOne({ _id: id })
        .then((tweetFound) => {

            if (tweetFound.tweetedBy._id.toString() === req.user._id.toString()) {

                return res.status(500).json({ error: "you can not like your tweet" })
            }

            if (tweetFound.likes.includes(req.user._id)) {
                return res.status(500).json({ error: "tweet already like by you" })
            }

            Tweet.findByIdAndUpdate(id, {
                $push: { likes: req.user._id }
            }, {
                new: true
            })
                .then((result) => {
                    res.status(200).json({ "success": "tweet liked by you" })
                })
                .catch((err) => { res.status(500).json({ err: err }) })

        })
        .catch((err) => { res.status(500).json({ err: err }) })

})


router.post('/Api/tweet/:id/dislike', protectedRoute, (req, res) => {
    const id = req.params.id

    Tweet.findOne({ _id: id })
        .then((tweetFound) => {

            if (tweetFound.tweetedBy._id.toString() === req.user._id.toString()) {

                return res.status(500).json({ error: "you can not dislike your tweet" })
            }

            if (tweetFound.likes.includes(req.user._id)) {
                Tweet.findByIdAndUpdate(id, {
                    $pull: { likes: req.user._id }

                }, {
                    new: true
                })
                    .then((result) => {
                        res.status(200).json({ "success": "tweet unliked by you" })
                    })
                    .catch((err) => { res.status(500).json({ err: err }) })
            }

            else {
                return res.json({ error : "you didn't like this post" })
            }

        })
        .catch((err) => { res.json({ error: err }) })


})


router.post("/API/tweet/:id/reply", protectedRoute, (req, res) => {
    const { content } = req.body;

    const tweetObj = new Tweet({ content, tweetedBy: req.user._id, type: "reply" });
    tweetObj
        .save()
        .then((newTweet) => {
            Tweet.findByIdAndUpdate(
                req.params.id,
                {
                    $push: { replies: newTweet._id }
                },
                {
                    new: true
                }
            )
                .then((result) => {

                    res.status(200).json({ result: result });
                })
                .catch((err) => {
                    res.status(500).json({ err: err });
                });
        })
        .catch((err) => {
            res.status(500).json({ err: err });
        });
});




router.get('/API/tweet/:id', protectedRoute, (req, res) => {
    Tweet.findOne({ _id: req.params.id })
        .populate("tweetedBy", "name username profilePicture")
        .populate({
            path: 'replies',
            select: 'content createdAt likes tweetedBy reTweetedBy replies',
            populate: {
                path: 'tweetedBy',
                select: 'username profilePicture'
            }
        })
        .then((tweet) => {
            res.status(200).json({ result: tweet })
        })
        .catch((err) => { res.status(500).json({ err: err }) })
})


router.get('/API/tweet/', protectedRoute, (req, res) => {
    Tweet.find({ type: "tweet" })
        .sort({ createdAt: -1 })
        .populate("tweetedBy", "name profilePicture username")
        .populate("replies", "content tweetedBy createdAt")
        .populate("reTweetedBy", "username")
        .populate("comments", "")
        .then((tweet) => { res.status(200).json({ result: tweet }) })
        .catch((err) => { res.status(500).json({ err: err }) })
})

router.delete('/API/tweet/:id', protectedRoute, (req, res) => {
    const id = req.params.id

    Tweet.findOne({ _id: id })
        .populate("tweetedBy", "_id name")

        .then((tweetFound) => {

            if (tweetFound.tweetedBy._id.toString() === req.user._id.toString()) {
                Tweet.deleteOne({ _id: id })
                    .then(() => { res.status(200).json({ result: "Tweet removed successfully" }) })
                    .catch((err) => { res.status(500).json({ error: err }) })
            }
            else {
                return res.json({ err: "error" })
            }

        })
        .catch((err) => { res.json({ error: "Tweet not found" }) })
})

router.post('/Api/tweet/:id/retweet', protectedRoute, (req, res) => {
    const id = req.params.id

    Tweet.findOne({ _id: id })
        .then((tweetFound) => {

            if (tweetFound.reTweetedBy.includes(req.user._id)) {
                return res.status(500).json({ error: "tweet already retweeted by you" })
            }

            Tweet.findByIdAndUpdate(id, {
                $push: { reTweetedBy: req.user._id }

            }, {
                new: true
            })
                .then((result) => {
                    res.status(200).json({ "success": "successfully retweeted by you" })
                })
                .catch((err) => { res.status(500).json({ err: err }) })

        })
        .catch((err) => { res.status(500).json({ error: err }) })

})


module.exports = router