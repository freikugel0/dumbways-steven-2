import express, { type Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../controllers/order-controller.js";

const router: Router = express.Router();

router.get("/orders", getOrders);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

export default router;
