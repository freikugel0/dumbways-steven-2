import { type Request, type Response } from "express";
import { posts, type Post } from "../models/post-model.js";
import { makeResponse } from "../utils/response.js";

export const getPosts = (req: Request, res: Response) => {
  res.status(200).json(makeResponse("Posts fetched successfully", posts));
};

export const createPost = (req: Request, res: Response) => {
  const { title, content } = req.body;

  const newPost: Post = {
    id: posts.length + 1,
    title,
    content,
  };

  posts.push(newPost);

  res.status(201).json(newPost);
};
