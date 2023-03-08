import Express from "express";
import multer from "multer";
import { pipeline } from "stream";
import { getBlogPosts, saveCoverImage } from "../../lib/fs-tools.js";
import { extname } from "path";
import { blogPostToPDFReadableStream } from "../../lib/pdf-tools.js";

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

// filesRouter.get("/:blogPostId/pdf", async (req, res, next) => {
//   try {
//     const blogPosts = await getBlogPosts();
//     const blogPostWithID = blogPosts.find(
//       (b) => b.id === req.params.blogPostId
//     );
//     if (blogPostWithID) {
//       res.setHeader("Content-Disposition", "attachment; filename=example.pdf");
//       const source = getPDFJSONReadableStream(blogPostWithID);
//       const destination = res;
//       pipeline(source, destination, (err) => {
//         if (err) console.log(err);
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

filesRouter.get("/:blogPostsId/pdf", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const foundBlogPost = blogPostsArray.find(
      (b) => b.id === req.params.blogPostsId
    );
    if (foundBlogPost) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${foundBlogPost.id}.pdf`
      ); //naming file
      const source = await blogPostToPDFReadableStream(foundBlogPost);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) console.log(err);
      });
    }
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
