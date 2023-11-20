import jwt from 'jsonwebtoken';

const secertKey = process.env.SECERT_KEY;

// JWT를 사용한 사용자 인증 미들웨어
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization; //api호출 할 때 헤더

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ message: '인증 실패: 토큰이 누락되었거나 올바르지 않습니다.' });
  }

  // 'Bearer' 부분 제외하고 실제 JWT 토큰 값 가져오기
  const jwtToken = token.split(' ')[1];

  // JWT 토큰 검증 try, catch 방법
  try {
    const decoded = jwt.verify(jwtToken, secertKey);
    res.locals.user = decoded;
    next();
  } catch (error) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '인증실패: 토큰 유효기간이 만료되었습니다.' });
    }
    return res.status(401).json({ message: '인증 실패: 유효하지 않은 토큰입니다.' });
  }
};

export default authenticateJWT;

// JWT 토큰 검증 콜백 방법
//  jwt.verify(jwtToken, secertKey, (err, decoded) => {
//   if (err) {
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: '인증실패: 토큰 유효기간이 만료되었습니다.' });
//     }
//     return res.status(401).json({ message: '인증 실패: 유효하지 않은 토큰입니다.' });
//   }
// })

// req.local에 사용자 정보 저장 but locals정보가 전부 날라갈 수 있음
// res.locals = {
//   user: decoded, // 디코딩된 JWT 페이로드 정보를 저장
// };
