const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Post, Company } = require('../models');

const router = express.Router();

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const search = decodeURIComponent(req.query);
      if (search) {
        const posts = await Post.findAll({
          attributes: ['id', 'positions', 'money', 'skill'],
          include: {
            model: Company,
            attributes: ['corp', 'country', 'area'],
          },
        });
        res.status(200).json(posts);
      } else {
        const posts = await Post.findAll({
          attributes: ['id', 'positions', 'money', 'skill'],
          include: {
            model: Company,
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

module.exports = router;
