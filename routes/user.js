const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const sha256 = require('crypto-js/sha256');
//const user = require('../models/user');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 회원가입시 각 입력 항목 유효성 검사
const validation = joi.object({
    userId: joi
        .string()
        .pattern(/[A-Za-z0-9가-힣]/)
        .min(2)
        .max(12)
        .required(),
    userMail: joi.string().email().trim(true).required(),
    passWord: joi
        .string()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!?@#$_])[A-Za-z\d!?@#$_]{8,16}$/)
        .required(),
});

// 회원가입 API
router.post('/register', async (req, res) => {
    try {
        const { userId, userMail, passWord } = await validation.validateAsync(req.body);

        const existId = await User.findOne({ userId }).exec();
        const existMail = await User.findOne({ userMail }).exec();

        if (existMail) {
            res.status(401).send({
                message: '이미 가입된 메일입니다.',
            });
            return;
        }
        if (existId) {
            res.status(401).send({
                message: '이미 사용중인 아이디입니다.',
            });
            return;
        }

        await User.create({
            userId: userId,
            userMail: userMail,
            passWord: sha256(passWord).toString(),
        });
        res.status(200).send({ message: '회원가입이 완료되었습니다!' });
    } catch (error) {
        let joiError = error.details[0].message;
        console.log(joiError);
        if (joiError.includes('userMail')) {
            res.status(401).send({
                message: '이메일 형식을 확인해주세요.',
            });
        }
        if (joiError.includes('passWord')) {
            res.status(401).send({
                message:
                    '비밀번호는 최소 8자 이상, 16자 이하의 영어 대소문자 및 숫자, 특수문자(!?@#$_)를 포함해야 합니다.',
            });
        }
    }
});

// 로그인 API
router.post('/login', async (req, res) => {
    const { userMail, passWord } = req.body;

    const user = await User.findOne({ userMail, passWord: sha256(passWord).toString() }).exec();

    if (!user) {
        res.status(401).send({
            message: '메일이나 비밀번호를 확인해주세요!',
        });
        return;
    }

    const token = jwt.sign({ userMail: user.userMail, userId: user.userId }, 'my-secret-key');
    res.status(200).send({
        token,
        userId: user.userId,
        message: '로그인 되었습니다.',
    });
});

module.exports = router;
