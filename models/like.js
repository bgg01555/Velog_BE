const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {
        type: String,
        // type: mongoose.Schema.Types.String,
        // ref: 'User',
    },
    postId: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Posts',
    },
});

module.exports = mongoose.model('Like', likeSchema);
