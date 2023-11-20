import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        gender: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        old: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
      },
    );
  }
  static associate(db) {
    db.User.hasMany(db.Product, { as: 'products', foreignKey: 'id', sourceKey: 'id' });
  }
}

// static 키워드는 클래스의 정적 메소드를 정의할 떄 사용 클랜스의 인스턴스가 아닌 클래스 이름으로 호출
