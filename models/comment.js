const mongoose = require("mongoose");
const CommentSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
},
{ timestamps: true }
);

CommentSchema.virtual("commentId").get(function () {
    return this._id.toHexString();
});
CommentSchema.set("toJSON", {
    virtuals: true,
});


module.exports = mongoose.model("Comments", CommentSchema);
