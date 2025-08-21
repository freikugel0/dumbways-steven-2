import "dotenv/config";
import express from "express";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import notFoundHandler from "./middlewares/notFound.js";
import serverErrorHandler from "./middlewares/serverError.js";

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);

// General error fallback
app.use(notFoundHandler);
app.use(serverErrorHandler);

app.listen(port, () => {
  console.log(`Running on :${port}`);
});
