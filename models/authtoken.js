'use strict';
const {
  Model
} = require('sequelize');

const {v4: uuidv4 } = require('uuid');


module.exports = (sequelize, DataTypes) => {
  class authToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      authToken.belongsTo(models.User, {foreignKey: 'user', as: 'user_id'})

    }
  }
  authToken.init({
    user: DataTypes.INTEGER,
    token: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'authToken',
  });

  authToken.createToken = async function (user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);
    let _token = uuidv4();
    let refreshToken = await authToken.create({
      token: _token,
      user: user.id,
      expiryDate: expiredAt.getTime()
    });
    return refreshToken.token;
  };

  authToken.verifyToken = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  return authToken;
};