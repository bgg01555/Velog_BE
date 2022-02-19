const express = require('express')
const Comment = require('../models/comment');
const Post = require('../models/post');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

//댓글 불러오기 past time 작성 예정
router.get('/:postId',async (req,res)=>{
    const {postId} = req.params;
    try{
        const comments = await Comment.find({postId:postId});
        return res.json({comments});
    }
    catch(e){
        console.log(e);
        return res.json({
            message: '댓글 불러오기에 실패했습니다',
        });
    }
})

//댓글 작성
router.post('/:postId',authMiddleware, async (req,res)=>{
    let { user } = res.locals;
    const {postId} = req.params;
    const {comment} = req.body;

    try {
        await Comment.create({postId:postId,userId:user.userId,comment:comment});
        return res.json({ message:'작성하신 댓글을 저장했습니다.' });
    } catch (e) {
        console.log(e);
        return res.json({message: '다시 시도해주세요.'});
    }
})

//댓글 수정
router.patch('/:commentId',authMiddleware, async (req,res)=>{
    let { user } = res.locals;
    const {commentId} = req.params;
    const {comment} = req.body;

    try {
        const findComment = await Comment.findOne({_id:commentId});
        console.log(findComment,user);
        console.log(findComment.userId,user.userId);

        if (findComment.userId === user.userId) {
            await Comment.findByIdAndUpdate({ _id: commentId },{ $set: { comment } }).exec();
            return res.json({ message:'댓글을 수정했습니다.' });
        } else {
            return res.status(400).json({ message: '수정 권한이 없습니다.' });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: '다시 시도해주세요.'});
    }
})

//댓글 삭제
router.delete('/:commentId',authMiddleware, async (req,res)=>{
    let { user } = res.locals;
    const {commentId} = req.params;

    try {
        let findComment = await Comment.findOne({_id:commentId});
        if (!findComment) {
            return res.status(404).json({
                message: '이미 삭제된 댓글입니다.',
            });
        }

        if(findComment.userId===user.userId) {
            await Comment.deleteOne({_id:commentId});
            return res.status(200).json({ message:'댓글을 삭제했습니다.' });
        }
        return res.status(400).json({message:'삭제 권한이 없습니다.'})
    } catch (e) {
        console.log(e);
        return res.status(500).json({message:'다시 시도해주세요.'});
    }

})

module.exports = router