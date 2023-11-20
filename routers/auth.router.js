import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/users.model.js';

const router = express.Router();

// 이메일 형식 체크 함수
const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //정규식 패턴매치
  return emailRegex.test(email);
};

// 회원가입 API
const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword, type } = req.body;

    // 이메일 형식 유효성 검사
    if (!validateEmailFormat(email)) {
      return res.status(400).send('올바른 이메일 형식이 아닙니다.');
    }

    // 비밀번호 길이 검사
    if (password.length < 6) {
      return res.status(400).send('비밀번호는 최소 6자 이상이어야 합니다.');
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      return res.status(400).send('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }

    // 이메일 중복 체크
    const isDuplicateEmail = await checkDuplicateEmail(email);
    if (isDuplicateEmail) {
      return res.status(400).send('중복된 이메일 주소입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 8);

    // 사용자 생성
    const user = await User.create({
      email,
      password: hashedPassword,
      type,
    });

    if (user) {
      return res.status(201).send('회원가입에 성공!');
    }
  } catch (err) {
    return res.status(500).send('회원가입 실패!' + err);
  }
};

// 로그인 API
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 입력된 이메일로 사용자 찾기
    const user = await User.findOne({ where: { email } });

    // 사용자가 없는 경우 에러 처리
    if (!user) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 일치 여부 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('비밀번호가 일치하지 않습니다.');
    }

    // JWT 생성
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' }); // 시크릿 키와 만료 시간을 설정합니다.

    // JWT 토큰을 클라이언트에게 전달
    res.status(200).json({ token });
  } catch (err) {
    return res.status(500).send('로그인 실패!' + err);
  }
};

// 라우터에 로그인 API 연결
router.post('/login', login);

// 회원가입 API 라우트
router.post('/signup', signup);

export default router;
