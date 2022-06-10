const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const { sequelize } = require('./models');
const postRouter = require('./routes/post');

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('database connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/posts', postRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} not found routes`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
