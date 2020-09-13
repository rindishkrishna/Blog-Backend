const Post = require("../Models/Post");
const async = require("../Middlewares/Async");
const util = require("../lib/commonFunctions");
const messages = require("../config/messages");
/**
 * @swagger
 *
 * /api/user/createPost:
 *   post:
 *     security:
 *       - Bearer: []
 *     description: Creates a post.It requires jwt token "auth" to be passed in headers.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Created a post
 */
exports.createPost = async (req, res) => {
  const slug = util.slugify(req.body.title);
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user.name,
    slug: slug,
  });
  await post.save();
  return res.send({
    message: messages.default.createPost,
    data: post,
    status: 200,
  });
};
/**
 * @swagger
 *
 * /api/user/posts:
 *   post:
 *     security:
 *       - Bearer: []
 *     description: View all Posts.It requires jwt token "auth" to be passed in headers.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: View all Posts
 */
exports.getAllPost = async (req, res) => {
  const query = await Post.find().sort({ createdOn: -1 });
  return res.send(query);
};
/**
 * @swagger
 *
 * /api/user/likePost:
 *   post:
 *     security:
 *       - Bearer: []
 *     description: Like a post.It requires jwt token "auth" to be passed in headers.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Like a post
 */
exports.likePost = async (req, res) => {
  const check = await Post.findById(req.body.id);
  for (let i = 0; i < check.likedBy.length; i = i + 1) {
    if (check.likedBy[i] == req.user.id) {
      const query = await Post.findByIdAndUpdate(
        req.body.id,
        {
          $inc: {
            likes: -1,
          },
        },
        {
          new: true,
        }
      );
      check.likedBy.splice(i, 1);
      await query.save();
      await check.save();
      return res.send({
        message: messages.default.unlikePost,
        status: 200,
      });
    }
  }
  for (let i = 0; i < check.dislikedBy.length; i = i + 1) {
    if (check.dislikedBy[i] == req.user.id) {
      const query = await Post.findByIdAndUpdate(
        req.body.id,
        {
          $inc: {
            dislikes: -1,
          },
        },
        {
          new: true,
        }
      );
      check.dislikedBy.splice(i, 1);
      await query.save();
      await check.save();
    }
  }
  const q = await Post.findByIdAndUpdate(
    req.body.id,
    {
      $inc: {
        likes: 1,
      },
    },
    {
      new: true,
    }
  );
  q.likedBy.push(req.user.id);
  await q.save();
  return res.send({
    message: messages.default.likePost,
    status: 200,
  });
};
/**
 * @swagger
 *
 * /api/user/dislikePost:
 *   post:
 *     security:
 *       - Bearer: []
 *     description: disLike a post.It requires jwt token "auth" to be passed in headers.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: disLike a post
 */
exports.dislikePost = async (req, res) => {
  const check = await Post.findById(req.body.id);
  for (let i = 0; i < check.dislikedBy.length; i = i + 1) {
    if (check.dislikedBy[i] == req.user.id) {
      const query = await Post.findByIdAndUpdate(
        req.body.id,
        {
          $inc: {
            dislikes: -1,
          },
        },
        {
          new: true,
        }
      );
      check.dislikedBy.splice(i, 1);
      await query.save();
      await check.save();
      return res.send({
        message: messages.default.removedislike,
        status: 200,
      });
    }
  }
  for (let i = 0; i < check.likedBy.length; i = i + 1) {
    if (check.likedBy[i] == req.user.id) {
      const query = await Post.findByIdAndUpdate(
        req.body.id,
        {
          $inc: {
            likes: -1,
          },
        },
        {
          new: true,
        }
      );
      check.likedBy.splice(i, 1);
      await query.save();
      await check.save();
    }
  }
  const q = await Post.findByIdAndUpdate(
    req.body.id,
    {
      $inc: {
        dislikes: 1,
      },
    },
    {
      new: true,
    }
  );
  await q.dislikedBy.push(req.user.id);
  await q.save();
  return res.send({
    message: messages.default.dislikePost,
    status: 200,
  });
};
