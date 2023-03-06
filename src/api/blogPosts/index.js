import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogPostSchema, triggerBadRequest } from "./validation.js"; //=> this will sometimes failed in auto-complete, make sure to check and ad .js
import { getBlogPosts, writeBlogPosts } from "../../lib/fs-tools.js";
const blogPostsRouter = Express.Router();

blogPostsRouter.post(
  "/",
  checkBlogPostSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newBlogPost = {
        ...req.body,
        id: uniqid(),
        avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const blogPostsArray = await getBlogPosts();
      blogPostsArray.push(newBlogPost);
      await writeBlogPosts(blogPostsArray);
      res.status(201).send({ id: newBlogPost.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    if (req.query && req.query.category) {
      const filteredBlogPosts = blogPosts.filter(
        (b) => b.category === req.query.category
      );
      res.send(filteredBlogPosts);
    } else {
      res.send(blogPosts);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const foundBlogPosts = blogPostsArray.find(
      (b) => b.id === req.params.blogPostId
    ); //refer to the router
    if (foundBlogPosts) {
      res.send(foundBlogPosts);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error); //
  }
});

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const index = blogPostsArray.findIndex(
      (b) => b.id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldPost = blogPostsArray[index];
      const updatedPost = { ...oldPost, ...req.body, updatedAt: new Date() };
      blogPostsArray[index] = updatedPost;
      writeBlogPosts(blogPostsArray);
      res.send(updatedPost);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const remainingPosts = blogPostsArray.filter(
      (b) => b.id !== req.params.blogPostId
    );
    if (blogPostsArray.length !== remainingPosts.length) {
      writeBlogPosts(remainingPosts);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const newComment = {
      ...req.body,
      comment_id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const blogPostsArray = await getBlogPosts();
    const index = blogPostsArray.findIndex((b) => b.id === req.params.id);
    blogPostsArray[index].comments.push(newComment);
    await writeBlogPosts(blogPostsArray);
    res.status(201).send("Comment Posted");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogPostsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const index = blogPostsArray.findIndex((b) => b.id === req.params.id);
    res.send(blogPostsArray[index].comments);
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
