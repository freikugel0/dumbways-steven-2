import express, { type Router } from "express";
import { createPost, getPosts } from "../controllers/post-controller.js";

const router: Router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", createPost);

export default router;
