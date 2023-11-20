import Sequelize from 'sequelize';
import * as configEX from '../config/config.js';
import User from './users.model.js';
import Product from './products.model.js';

// 환경변수에 따라 config를 설정
const env = process.env.NODE_ENV || 'development';
const config = configEX[env];
const db = {};

// db 객체에 sequelize 객체를 저장
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.sequelize = sequelize;

db.User = User;
db.Product = Product;

User.init(sequelize);
Product.init(sequelize);

User.associate(db);
Product.associate(db);

export default db;
