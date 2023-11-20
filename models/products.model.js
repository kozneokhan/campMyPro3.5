import { Model, DataTypes } from 'sequelize';

export default class Product extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        state: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'FOR_SALE',
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
    db.Product.belongsTo(db.User, { foreignKey: 'id', targetKey: 'id' });
  }
}
