import Express from "express";
import multer from "multer";
import { pipeline } from "stream";
import {
  getBlogPosts,
  saveCoverImage,
  writeBlogPosts,
} from "../../lib/fs-tools.js";
import { extname } from "path";
import { blogPostToPDFReadableStream } from "../../lib/pdf-tools.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const filesRouter = Express.Router();
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "BlogPosts/covers" },
  }),
}).single("uploadCover");

filesRouter.post(
  "/:id/uploadCover",
  // multer().single("uploadCover"),
  cloudinaryUploader,
  async (req, res, next) => {
    //uploadCover here must be match with the FE and postman when upload... (link)
    try {
      const allBlogPosts = await getBlogPosts();
      const blogPostsId = req.params.id;
      const index = allBlogPosts.findIndex((b) => b.id === blogPostsId);
      if (index !== -1) {
        const oldPost = allBlogPosts[index];
        const updatedPost = {
          ...oldPost,
          ...req.body,
          cover: req.file.path,
          updatedAt: new Date(),
        };
        allBlogPosts[index] = updatedPost;
        await writeBlogPosts(allBlogPosts);
        console.log("FILE:", req.file);
        res.send({ message: "file uploaded" });
      }
      // const originalFileExtension = extname(req.file.originalname);
      // const fileName = req.params.id + originalFileExtension; // using the same "id" name from link/ router
      // await saveCoverImage(fileName, req.file.buffer);
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
