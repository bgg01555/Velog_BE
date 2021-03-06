const express = require('express');
const connect = require('./models/index');
const cors = require('cors');
const app = express();
const port = 3000;
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const likeRouter = require('./routes/like');
require('dotenv').config();

connect();

app.use((req, res, next) => {
    console.log(
        'Request URL:',
        `[${req.method}]`,
        req.originalUrl,
        ' - ',
        new Date().toLocaleString()
    );
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/user', [userRouter]);
app.use('/post', [postRouter]);
app.use('/comment', [commentRouter]);
app.use('/like', [likeRouter]);

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌습니다.');
});
