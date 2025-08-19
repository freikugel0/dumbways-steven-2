import type { Request, Response } from "express";
import { makeResponse } from "../utils/response.js";
import { query } from "../utils/db.js";
import type { Order } from "../models/order-model.js";

export const getOrders = async (req: Request, res: Response) => {
  const result = await query(
    `SELECT 
       o.order_id, 
       o.qty, 
       p.product_id, 
       p.name AS product_name, 
       p.price AS product_price
     FROM orders o
     JOIN products p ON o.product_id = p.product_id`,
  );

  res
    .status(200)
    .json(makeResponse("Orders fetched successfully", result.rows));
};

export const createOrder = async (req: Request, res: Response) => {
  const body: Order = req.body;

  const result = await query(
    "INSERT INTO orders (product_id, qty) VALUES ($1, $2) RETURNING *",
    [body.product_id, body.qty],
  );

  res.status(201).json(makeResponse("Order created successfully", result.rows));
};

export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Omit<Order, "order_id"> = req.body;

  const result = await query(
    "UPDATE orders SET product_id = $1, qty = $2 WHERE order_id = $3 RETURNING *",
    [body.product_id, body.qty, id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json(makeResponse("Order not found", null));
  }

  res
    .status(200)
    .json(makeResponse("Order updated successfully", result.rows[0]));
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    "DELETE FROM orders WHERE order_id = $1 RETURNING *",
    [id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json(makeResponse("Order not found", null));
  }

  return res.status(204).send();
};
