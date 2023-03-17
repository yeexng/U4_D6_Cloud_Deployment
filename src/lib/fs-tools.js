import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createReadStream, createWriteStream } from "fs";

const { readJSON, writeJSON, writeFile } = fs;

// C:\Users\xuan\Desktop\FS 05-22\Unit 4\U4_D4_Files_Upload\src\data
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
console.log("DATA PATH:", dataFolderPath);
//authorPath
///Users/xuanng/Desktop/Epicode/U4_D4_Files_Upload/public/img/authors
const authorsJSONPath = join(dataFolderPath, "authors.json");
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors");
// console.log(authorsPublicFolderPath);
//blogPostsPath
const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json");
const blogPostsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts");
// console.log(blogPostsPublicFolderPath);

//JSON Path Function
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONPath, authorsArray);
export const getBlogPosts = () => readJSON(blogPostsJSONPath);
export const writeBlogPosts = (blogPostsArray) =>
  writeJSON(blogPostsJSONPath, blogPostsArray);

// save Image
export const saveCoverImage = (fileName, fileContentAsBuffer) =>
  writeFile(join(blogPostsPublicFolderPath, fileName), fileContentAsBuffer);
export const saveAuthorImage = (fileName, fileContentAsBuffer) => {
  writeFile(join(authorsPublicFolderPath, fileName), fileContentAsBuffer);
};

export const getAuthorsJSONReadableStream = () =>
  createReadStream(authorsJSONPath);

export const getBlogPostsJSONReadableStream = () =>
  createReadStream(blogPostsJSONPath);
export const getBlogPostsPDFWriteStream = (fileName) =>
  createWriteStream(join(dataFolderPath, fileName));
