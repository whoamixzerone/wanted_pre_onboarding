const express = require('express');
const url = require('url');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Post, Company, Support } = require('../models');

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const query = url.parse(req.url, true).query;
      const search = query.search || null;
      if (search) {
        const posts = await Post.findAll({
          include: {
            model: Company,
            as: 'companys',
            attributes: ['corp', 'country', 'area'],
            required: true,
          },
          attributes: ['id', 'positions', 'money', 'skill'],
          where: {
            [Op.or]: {
              [`$companys.corp$`]: {
                [Op.like]: `%${search}%`,
              },
              positions: {
                [Op.like]: `%${search}%`,
              },
              skill: {
                [Op.like]: `%${search}%`,
              },
            },
          },
        });
        res.status(200).json(posts);
      } else {
        const posts = await Post.findAll({
          attributes: ['id', 'positions', 'money', 'skill'],
          include: {
            model: Company,
            as: 'companys',
            attributes: ['corp', 'country', 'area'],
          },
        });
        res.status(200).json(posts);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => {
    const { compId, positions, money, content, skill } = req.body;
    try {
      const post = await Post.create({
        positions: positions,
        money: money,
        content: content,
        skill: skill,
        compId: compId,
      });
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router
  .route('/:id')
  .get(async (req, res, next) => {
    const postId = req.params.id;
    try {
      const post = await Post.findOne({
        attributes: ['id', 'positions', 'money', 'content', 'skill', 'compId'],
        where: { id: postId },
        include: {
          model: Company,
          as: 'companys',
          attributes: ['corp', 'country', 'area'],
        },
      });

      let _id = await Post.findAll({
        attributes: ['id'],
        where: { compId: post.compId },
      });
      _id = _id.map((i) => i.id);

      const data = post.dataValues;
      data['corpPosts'] = _id;
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      const postId = req.params.id;
      const { positions, money, content, skill } = req.body;
      await Post.update(
        {
          positions: positions,
          money: money,
          content: content,
          skill: skill,
        },
        {
          where: { id: postId },
        }
      );
      res.redirect('/posts');
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const postId = req.params.id;
      await Post.destroy({
        where: { id: postId },
      });
      res.redirect('/posts');
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.post('/:id/application', async (req, res, next) => {
  try {
    const userId = req.headers.cookie.split('=');
    const support = await Support.findOne({ where: { userId: userId } });
    if (!support) {
      const postId = req.params.id;
      const support = await Support.create({
        userId: parseInt(userId[1]),
        postId: parseInt(postId),
      });
      res.status(201).json(support);
    } else {
      const error = new Error('해당 채용공고에 지원한 상태입니다.');
      next(error);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
