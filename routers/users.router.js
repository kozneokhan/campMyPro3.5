import express from 'express';
import db from '../models/index.js';
import authenticateJWT from '../middlewares/authenticateJWT.js';

const router = express.Router();
const { User } = db;

// 사용자 정보 조회 API 엔드포인트
router.get('/my-info', authenticateJWT, async (req, res) => {
  try {
    // req.locals에서 디코딩된 사용자 정보 가져오기
    const user = req.locals.user;

    // 사용자 정보에서 비밀번호를 제외한 내 정보를 가져오기
    const userInfo = await User.findByPk(user.userId, {
      attributes: { exclude: ['password'] }, // 비밀번호를 제외한 정보를 가져옵니다.
    });

    if (!userInfo) {
      return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
    }

    // 비밀번호를 제외한 내 정보 반환
    res.json({ user: userInfo });
  } catch (error) {
    console.error('내 정보 조회 에러:', error);
    res.status(500).json({ message: '내 정보 조회 중 에러가 발생했습니다.' });
  }
});

export default router;
