const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const auth = require('../middlewares/auth-middleware');
const time2str = require('../modules/time2str');
const upload = require('../modules/multer');

//썸네일
router.post('/imagetest', upload.single('image'), (req, res) => {
    res.json({ url: req.file.location });
});

//게시물 작성
router.post('/', auth, async (req, res) => {
    const { title, tag, contents, thumbnail, introduce } = req.body;
    const { user } = res.locals;

    await Post.create({
        userId: user.userId,
        title,
        tag,
        contents,
        thumbnail,
        introduce,
    });

    res.status(200).json({ mssage: '게시물이 저장되었습니다.' });
});

//전체 게시물 조회
router.get('/', async (req, res) => {
    const posts = await Post.find({}).sort({ createdAt: 1 });
    let { category } = req.query;

    for (let i = 0; i < posts.length; i++) {
        posts[i]._doc.pastTime = time2str(posts[i].createdAt);
        posts[i]._doc.commentCnt = await Comment.count({ postId: posts[i]._id });
    }

    let today = new Date();
    let thisyear = today.getFullYear();
    let thismonth = today.getMonth();
    let weekstart, weekend;
    let thisday = today.getDate();

    weekstart = thisday - today.getDay();
    weekend = weekstart + 6;

    let filtered;

    if (category === 'year') {
        filtered = posts.filter((val) => {
            return val.createdAt.getFullYear() === thisyear;
        });
    } else if (category === 'month') {
        filtered = posts.filter((val) => {
            return (
                val.createdAt.getFullYear() === thisyear && val.createdAt.getMonth() === thismonth
            );
        });
    } else if (category === 'week') {
        filtered = posts.filter((val) => {
            return (
                val.createdAt.getFullYear() === thisyear &&
                val.createdAt.getMonth() === thismonth &&
                val.createdAt.getDate() >= weekstart &&
                val.createdAt.getDate() <= weekend
            );
        });
    } else if (category === 'day') {
        filtered = posts.filter((val) => {
            return (
                val.createdAt.getFullYear() === thisyear &&
                val.createdAt.getMonth() === thismonth &&
                val.createdAt.getDate() === thisday
            );
        });
    } else {
        posts.reverse();
        return res.status(200).json({ posts });
    }

    return res.status(200).json({
        posts: filtered.sort((a, b) => {
            if (a.likeCount < b.likeCount) return 1;
            else return -1;
        }),
    });
});

//특정 게시물 조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId });

    try {
        post._doc.pastTime = time2str(post.createdAt);
        post._doc.commentCnt = await Comment.count({ postId: postId });
        res.status(200).json({
            post,
        });
    } catch (err) {
        res.status(404).json({
            message: '삭제된 게시물 입니다.',
        });
    }
});

//특정 게시물 수정
router.patch('/:postId', auth, async (req, res) => {
    const { user } = res.locals;
    const { postId } = req.params;
    const { title, tag, contents, introduce, thumbnail } = req.body;
    const targetPost = await Post.findOne({ _id: postId });

    if (!targetPost) {
        return res.status(400).json({
            message: '다시 시도해주세요.',
        });
    } else {
        if (user.userId === targetPost.userId) {
            await Post.updateOne(
                { _id: postId },
                { $set: { title, tag, contents, thumbnail, introduce } }
            );
            res.status(200).json({
                message: '게시물이 수정되었습니다.',
            });
        } else {
            return res.status(400).json({
                message: '수정 권한이 없습니다.',
            });
        }
    }
});

//특정 게시물 삭제
router.delete('/:postId', auth, async (req, res) => {
    const { postId } = req.params;
    const { user } = res.locals;

    const targetPost = await Post.findOne({ _id: postId });

    if (!targetPost) {
        return res.status(400).send({ message: '다시 시도해주세요.' });
    } else {
        if (user.userId === targetPost.userId) {
            await Post.deleteOne({ _id: postId });
            res.send({
                message: '게시물이 삭제되었습니다.',
            });
        } else {
            return res.status(400).send({ message: '삭제 권한이 없습니다.' });
        }
    }
});

module.exports = router;
