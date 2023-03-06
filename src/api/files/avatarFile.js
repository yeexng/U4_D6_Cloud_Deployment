import Express from "express";
import multer from "multer";
import { saveAuthorImage } from "../../lib/fs-tools.js";
import { extname } from "path";

const filesAvatarRouter = Express.Router();

filesAvatarRouter.post(
  "/:id/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      // console.log("FILE:", req.file);
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.id + originalFileExtension;
      await saveAuthorImage(fileName, req.file.buffer);
      res.send({ message: "avatar updated" });
    } catch (error) {
      next(error);
    }
  }
); //"avatar" will be use as a query to match

export default filesAvatarRouter;
