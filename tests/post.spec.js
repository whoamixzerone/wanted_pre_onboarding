const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /posts', () => {
  beforeEach((done) => {
    sequelize.models.Company.create({
      corp: '원티트랩',
      country: '한국',
      area: '서울',
    });
    done();
  });

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
      .put('/posts/:id')
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
      .delete('/posts/:id')
      .expect('Location', '/posts')
      .expect(302, done);
  });
});

describe('GET /posts', () => {
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

afterAll(async () => {
  await sequelize.sync({ force: true });
});
