const app = require('../app');

app.listen(app.get('port'), () => {
  console.log(app.get('port'), 'port listening');
});
