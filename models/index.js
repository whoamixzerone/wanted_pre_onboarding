const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Company = require('./company');
const Post = require('./post');
const Support = require('./support');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Company = Company;
db.Post = Post;
db.Support = Support;

User.init(sequelize);
Company.init(sequelize);
Post.init(sequelize);
Support.init(sequelize);

User.associate(db);
Company.associate(db);
Post.associate(db);
Support.associate(db);

module.exports = db;
