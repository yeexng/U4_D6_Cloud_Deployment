import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";
import { checkAuthorSchema, triggerBadRequest } from "./validation.js";
const authorsRouter = Express.Router();

authorsRouter.post(
  "/",
  checkAuthorSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newAuthor = {
        ...req.body,
        id: uniqid(),
        avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const authorsArray = await getAuthors();
      authorsArray.push(newAuthor);
      writeAuthors(authorsArray);
      res.status(201).send({ id: newAuthor.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    const foundAuthor = authorsArray.find((a) => a.id === req.params.authorId);
    if (foundAuthor) {
      res.send(foundAuthor);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.authorId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    const index = authorsArray.findIndex((a) => a.id === req.params.authorId);
    if (index !== -1) {
      const oldAuthor = authorsArray[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...req.body,
        updatedAt: new Date(),
      };
      authorsArray[index] = updatedAuthor;
      writeAuthors(authorsArray);
      res.send(updatedAuthor);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.authorId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const authorsArray = await getAuthors();
    const remainingAuthors = authorsArray.filter(
      (author) => author.id !== req.params.authorId
    );
    if (authorsArray.length !== remainingAuthors.length) {
      writeAuthors(remainingAuthors);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.authorId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
