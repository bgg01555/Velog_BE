const mongoose = require("mongoose");
const Comment = require('../models/comment');

const postSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true,
    },
},{ timestamps: true });


UserSchema.virtual("postId").get(function () {
    return this._id.toHexString();
});
UserSchema.set("toJSON", {
    virtuals: true,
});

postSchema.pre(
    "deleteOne", { document: false, query: true },
    async function (next) {
        const { _id } = this.getFilter();
        await Comment.deleteMany({ postId: _id });
        next();
    }
);


module.exports = mongoose.model("Articles", ArticleSchema);
