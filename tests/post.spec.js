const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync();
  await sequelize.models.User.create({
    name: '손오공',
    email: 'test@gmail.com',
    password: '1234',
  });
  await sequelize.models.Company.create({
    corp: '원티트랩',
    country: '한국',
    area: '서울',
  });
});

describe('POST /posts', () => {
  test('채용공고 등록', (done) => {
    request(app)
      .post('/posts')
      .send({
        compId: 1,
        positions: 'Backend Application Developer',
        money: 1500000,
        content: '원티드랩에서 백엔드 개발자를 채용합니다.',
        skill: 'Node.js',
      })
      .expect(201)
      .end((err, res) => {
        if (err) throw err;

        expect(res.body).toBeInstanceOf(Object);
        done();
      });
  });
});

describe('PUT /posts/:id', () => {
  test('채용공고 수정', (done) => {
    request(app)
      .put('/posts/1')
      .send({
        positions: 'Backend Application Developer',
        money: 1500000,
        content: '원티드랩에서 백엔드 개발자를 채용합니다.',
        skill: 'Node.js',
      })
      .expect('Location', '/posts')
      .expect(302, done);
  });
});

describe('DELETE /posts/:id', () => {
  test('채용공고 삭제', (done) => {
    request(app)
      .delete('/posts/1')
      .expect('Location', '/posts')
      .expect(302, done);
  });
});

describe('GET /posts', () => {
  beforeEach((done) => {
    request(app)
      .post('/posts')
      .send({
        compId: 1,
        positions: 'Backend Application Developer',
        money: 1000000,
        content: '원티드랩에서 백엔드 개발자를 채용합니다.',
        skill: 'Node.js',
      })
      .end(done);
  });

  test('채용공고 목록 조회', (done) => {
    request(app)
      .get('/posts')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toBeInstanceOf(Array);
        done();
      });
  });
});

describe('GET /posts/:id', () => {
  test('채용공고 상세 페이지', (done) => {
    request(app)
      .get('/posts/2')
      .expect(200)
      .end((err, res) => {
        expect(res.body).toHaveProperty('id', 2);
        done();
      });
  });
});

describe('POST /posts/:id/application', () => {
  test('채용공고 지원', (done) => {
    request(app)
      .post('/posts/2/application')
      .set('Cookie', 'userId=1')
      .end((err, res) => {
        expect(res.body).toHaveProperty('userId', 1);
        expect(res.body).toHaveProperty('postId', 2);
        done();
      });
  });

  test('채용공고 지원한 상태일때', (done) => {
    request(app)
      .post('/posts/2/application')
      .set('Cookie', 'userId=1')
      .end((err) => {
        if (err) done(err);
        done();
      });
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});
