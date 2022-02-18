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

UserSchema.virtual("commentId").get(function () {
    return this._id.toHexString();
});
UserSchema.set("toJSON", {
    virtuals: true,
});


module.exports = mongoose.model("Comments", CommentSchema);
