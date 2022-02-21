const mongoose = require('mongoose');
const Comment = require('../models/comment');

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        tag: {
            type: Array,
        },
        contents: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        introduce: {
            type: String,
            required: true,
        },
        // likeCount:{
        //     type:Number,
        //     default:0
        // }
    },
    { timestamps: true }
);

postSchema.virtual('postId').get(function () {
    return this._id.toHexString();
});
postSchema.set('toJSON', {
    virtuals: true,
});
// postSchema.set("toObject", {
//     virtuals: true,
// });

postSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const { _id } = this.getFilter();
    await Comment.deleteMany({ postId: _id });
    next();
});

module.exports = mongoose.model('Posts', postSchema);
