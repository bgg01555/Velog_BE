const express = require('express')
const Comment = require('../models/comment');
const Post = require('../models/post');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

//댓글 불러오기
router.get('/:postId',async (req,res)=>{
    const {postId} = req.params;
    const comments = await Comment.find({postId:postId});


    await Post.create({title:'testTitle1',tag:['1','1','1'],contents:'testContents1',thumbnail:'testurl1',introduce:'testIntro1'});
    await Post.create({title:'testTitle2',tag:['2','2','2'],contents:'testContents2',thumbnail:'testurl2',introduce:'testIntro2'});
    await Post.create({title:'testTitle3',tag:['3','3','3'],contents:'testContents3',thumbnail:'testurl3',introduce:'testIntro3'});
    await Post.create({title:'testTitle4',tag:['4','4','4'],contents:'testContents4',thumbnail:'testurl4',introduce:'testIntro4'});
    await Post.create({title:'testTitle5',tag:['5','5','5'],contents:'testContents5',thumbnail:'testurl5',introduce:'testIntro5'});

    res.json({comments});
})

//댓글 작성
router.post('/:postId',authMiddleware, (req,res)=>{
    const {postId} = req.params;
    const {comment} = req.body;


})

//댓글 수정
router.patch('/:commentId',authMiddleware,(req,res)=>{
    const {commentId} = req.params;
    const {comment} = req.body;

})

//댓글 삭제
router.delete('/:commentId',authMiddleware,(req,res)=>{
    const {commentId} = req.params;


})

module.exports = router