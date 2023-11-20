import express from 'express';
import db from './models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000; // const SERVER_PORT = 3000;

app.use(express.json());

dotenv.config();

//Router 설정

// DB연결 확인하기
const { sequelize } = db;
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((error) => {
    console.log('데이터베이스 연결 실패: ', error);
  });

app.listen(SERVER_PORT, () => {
  console.log(SERVER_PORT, '포트로 서버가 열렸습니다.');
});
