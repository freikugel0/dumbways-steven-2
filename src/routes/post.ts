import express, { type Router } from "express";
import {
  getPosts,
  createPost,
  deletePost,
  detailPost,
  updatePost,
} from "../controllers/post.js";
import { getCommentsSummary, getPostComments } from "../controllers/comment.js";

const router: Router = express.Router();

router.get("/posts", getPosts);

router.get("/posts/comments-summary", getCommentsSummary);
router.get("/posts/:postId/comments", getPostComments);

router.get("/posts/:id", detailPost);
router.post("/posts", createPost);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id", updatePost);

export default router;
