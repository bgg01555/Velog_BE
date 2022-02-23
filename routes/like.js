const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const auth = require('../middlewares/auth-middleware');
const Like = require('../models/like');

//좋아요 데이터 보내주기
router.get('/', auth, async (req, res) => {
    let { user } = res.locals;
    const LikedData = await Like.find({ userId: user.userId }).select({ postId: 1 });
    console.log(LikedData);
    res.status(200).json({ list: LikedData });
});

// 게시글 좋아요 저장
router.post('/:postid', auth, async (req, res) => {
    const { user } = res.locals;
    const variable = { postId: req.params.postid, userId: user.userId };

    let islike = await Like.findOne({ userId: user.userId, postId: req.params.postid });
    if (islike) {
        return res.status(400).json({ message: '이미 좋아요를 누른 포스트 입니다.' });
    } else {
        await Like.create(variable);
        let cnt = await Like.count({ postId: req.params.postid });
        await Post.findByIdAndUpdate(req.params.postid, {
            likeCount: cnt,
        });
        res.status(200).json({ message: '좋아요 추가됐습니다.' });
    }
});

// 게시글 좋아요 해제
router.delete('/:postid', auth, async (req, res) => {
    const { user } = res.locals;
    const variable = { postId: req.params.postid, userId: user.userId };

    let islike = await Like.findOne({ userId: user.userId, postId: req.params.postid });
    if (islike) {
        await Like.deleteOne(variable);
        let cnt = await Like.count({ postId: req.params.postid });
        await Post.findByIdAndUpdate(req.params.postid, {
            likeCount: cnt,
        });
        res.status(200).json({ message: '좋아요 삭제됐습니다.' });
    } else {
        return res.status(400).json({ message: '이미 좋아요를 삭제한 포스트 입니다.' });
    }
});

module.exports = router;
