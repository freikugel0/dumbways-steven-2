import express, { type Router } from "express";
import { getAllUsers, getMe } from "../controllers/user.js";
import { authorize, requireAuth } from "../middlewares/authz.js";

const router: Router = express.Router();

router.get("/me", requireAuth, getMe);
router.get("/users", requireAuth, authorize(["ADMIN"]), getAllUsers);

export default router;
