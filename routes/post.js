const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const auth = require("../middlewares/auth-middleware");
const cors = require('cors');
const res = require('express/lib/response');
const time2str = require('../modules/time2str');


//게시물 작성
router.post('/', async (req, res) => {
    const {  userId, title, tag, contents, thumbnail, introduce  } = req.body;
    // const userId = res.locals.user.userId

    await Post.create({
        userId,
        title,
        tag,
        contents,
        thumbnail,
        introduce
    });

    res.status(200).json({ mssage: "게시물이 저장되었습니다."});
});

//전체 게시물 조회
router.get('/', async (req, res) => {
    const posts = await Post.find({})
    for(let i=0;i<posts.length;i++){
        posts[i]._doc.pastTime = time2str(posts[i].createdAt);
    }
    res.status(200).json({ posts });
})


//특정 게시물 조회
router.get("/:postId", async (req, res) => {
    const { postId } = req.params
    const post = await Post.findOne({ postId })
    post._doc.pastTime=time2str(post.createdAt);
    res.status(200).json({
        post
    })
})
//특정 게시물 수정
router.patch('/:postId', async (req, res) => {
    const { postId, title, tag, contents, thumbnail, introduce } = req.body;
    const targetPost = await Post.findOne({ postId })
    if ( !targetPost ) {
        return res.status(400).json({
            message: "다시 시도해주세요."
        })
    } else {
        await Post.updateOne({ _id : postId }, { $set: { title, tag, contents, thumbnail, introduce } })
        res.status(200).json({
            message: "게시물이 수정되었습니다."
        })
    }
})

//특정 게시물 삭제
router.delete("/:postId", async (req, res) => {
    const { postId } = req.params

    const targetPost = await Post.findOne({ postId })

    if (!targetPost) {
        return res.status(400).send({ message: '다시 시도해주세요.' })
    } else { 
        await Post.deleteOne({ _id : postId }) 
        res.send({
            message: '게시물이 삭제되었습니다.'
        })
    }
})
module.exports = router;
