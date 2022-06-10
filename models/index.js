const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Company = require('./company');
const Post = require('./post');

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

User.init(sequelize);
Company.init(sequelize);
Post.init(sequelize);

User.associate(db);
Company.associate(db);
Post.associate(db);

module.exports = db;
