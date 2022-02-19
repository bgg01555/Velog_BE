const express = require('express')
const connect = require("./models/index");
const cors = require('cors');

const app = express()
const port = 3000;
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
//require('dotenv').config()

connect();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/user", [userRouter]);
app.use("/post", [postRouter]);
app.use("/comment", [commentRouter]);


app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌습니다.');
})