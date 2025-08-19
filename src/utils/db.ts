import { Pool } from "pg";

const pool = new Pool({
  user: "xjeil",
  host: "localhost",
  database: "product_cart_db",
  password: "42685",
  port: 5432,
});

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};
