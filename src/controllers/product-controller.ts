import type { Request, Response } from "express";
import { makeResponse } from "../utils/response.js";
import { query } from "../utils/db.js";
import type { Product } from "../models/product-model.js";

export const getProducts = async (req: Request, res: Response) => {
  const result = await query("SELECT * FROM products");

  res
    .status(200)
    .json(makeResponse("Products fetched successfully", result.rows));
};

export const createProduct = async (req: Request, res: Response) => {
  const body: Product = req.body;

  const result = await query(
    "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
    [body.name, body.price],
  );

  res
    .status(201)
    .json(makeResponse("Product created successfully", result.rows));
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Omit<Product, "product_id"> = req.body;

  const result = await query(
    "UPDATE products SET name = $1, price = $2 WHERE product_id = $3 RETURNING *",
    [body.name, body.price, id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json(makeResponse("Product not found", null));
  }

  res
    .status(200)
    .json(makeResponse("Product updated successfully", result.rows[0]));
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await query(
    "DELETE FROM products WHERE product_id = $1 RETURNING *",
    [id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json(makeResponse("Product not found", null));
  }

  return res.status(204).send();
};
