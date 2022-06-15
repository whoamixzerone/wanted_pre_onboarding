const Sequelize = require('sequelize');

module.exports = class Support extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: false,
        paranoid: false,
        underscored: false,
        modelName: 'Support',
        tableName: 'supports',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Support.belongsTo(db.User, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
    db.Support.belongsTo(db.Post, {
      foreignKey: 'postId',
      sourceKey: 'id',
    });
  }
};
