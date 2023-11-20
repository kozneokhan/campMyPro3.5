import express from 'express';
import authenticateJWT from '../middlewares/need-signin.middleware.js';
import Products from '../models/products.model.js';
import User from '../models/users.model.js';

const router = express.Router();

// 인증기능 추가하기
// 상품 생성 API(인증필요 - 인증 Middleware 사용)
outer.post('/products', authenticateJWT, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.locals.user.id; // JWT로부터 사용자 ID 가져오기

    const newProduct = await Product.create({
      title,
      content,
      state: 'FOR_SALE', // 기본 상태: 판매 중
      password, // 비밀번호 설정 (해싱 된 비밀번호로 저장되어야 함)
      userId, // User 모델과의 관계 설정을 위해 UserId로 설정
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('상품 생성 에러:', error);
    res.status(500).json({ message: '상품 생성 중 에러가 발생했습니다.' });
  }
});

// 상품 수정 API(인증 필요 - 인증 Middleware 사용)
router.put('/products/:productId', authenticateJWT, async (req, res) => {
  try {
    const { title, content, state } = req.body;
    const { productId } = req.params;
    const userId = req.locals.user.id; // JWT로부터 사용자 ID 가져오기

    const product = await Product.find(productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (product.UserId !== userId) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    await Product.update({ title, content, state }, { where: { id: productId, UserId: userId } });

    res.json({ message: '상품이 수정되었습니다.' });
  } catch (error) {
    console.error('상품 수정 에러:', error);
    res.status(500).json({ message: '상품 수정 중 에러가 발생했습니다.' });
  }
});

// 상품 삭제 API(인증 필요 - 인증 Middleware 사용)
router.delete('/products/:productId', authenticateJWT, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.locals.user.id; // JWT로부터 사용자 ID 가져오기

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: '상품 조회에 실패하였습니다.' });
    }

    if (product.UserId !== userId) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    await Product.destroy({ where: { id: productId, UserId: userId } });

    res.json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    console.error('상품 삭제 에러:', error);
    res.status(500).json({ message: '상품 삭제 중 에러가 발생했습니다.' });
  }
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
  try {
    const productList = await Product.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }], // 사용자 정보 JOIN
      attributes: ['id', 'title', 'content', 'state', 'createdAt'], // 필요한 속성만 선택
      order: [['createdAt', 'DESC']], // 작성 날짜를 기준으로 최신순 정렬
    });

    res.json(productList);
  } catch (error) {
    console.error('상품 목록 조회 에러:', error);
    res.status(500).json({ message: '상품 목록 조회 중 에러가 발생했습니다.' });
  }
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByPk(productId, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }], // 사용자 정보 JOIN
      attributes: ['id', 'title', 'content', 'state', 'createdAt'], // 필요한 속성만 선택
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(product);
  } catch (error) {
    console.error('상품 상세 조회 에러:', error);
    res.status(500).json({ message: '상품 상세 조회 중 에러가 발생했습니다.' });
  }
});

export default router;
