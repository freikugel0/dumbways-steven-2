import express, { type Router } from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  detailUser,
  updateUser,
} from "../controllers/user.js";

const router: Router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", detailUser);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

export default router;
