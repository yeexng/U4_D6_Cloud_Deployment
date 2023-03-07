import Express from "express";
import multer from "multer";
import { getBlogPosts, saveCoverImage } from "../../lib/fs-tools.js";
import { extname } from "path";
import { getPDFJSONReadableStream } from "../../lib/pdf-tools.js";

const filesRouter = Express.Router();

filesRouter.post(
  "/:id/uploadCover",
  multer().single("uploadCover"),
  async (req, res, next) => {
    //uploadCover here must be match with the FE and postman when upload... (link)
    try {
      console.log("FILE:", req.file);
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.id + originalFileExtension; // using the same "id" name from link/ router
      await saveCoverImage(fileName, req.file.buffer);
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

// filesRouter.post("/uploadCover", multer().array(), async (req, res, next) => {
//   try {
//     res.send({ message: "file uploaded" });
//   } catch (error) {
//     next(error);
//   }
// });

// filesRouter.post("/uploadAvatar", multer(), async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

filesRouter.get("/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=example.pdf");
    const blogPosts = await getBlogPosts();
    const source = getPDFJSONReadableStream(blogPosts[0]);
    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
