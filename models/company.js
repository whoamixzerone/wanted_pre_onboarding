const Sequelize = require('sequelize');

module.exports = class Company extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        corp: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        country: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        area: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        paranoid: false,
        underscored: false,
        modelName: 'Company',
        tableName: 'companys',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    db.Company.hasMany(db.Post, { foreignKey: 'compId' });
  }
};
