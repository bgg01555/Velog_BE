const express = require('express')
const Comment = require('../models/comment');
const Post = require('../models/post');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

//댓글 불러오기
router.get('/:postId',async (req,res)=>{
    const {postId} = req.params;
    const comments = await Comment.find({postId:postId});

    console.log(postId);
    console.log(comments);

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