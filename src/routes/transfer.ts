import express, { type Router } from "express";
import { transferPoints } from "../controllers/transfer.js";

const router: Router = express.Router();

router.post("/transfer-points", transferPoints);

export default router;
