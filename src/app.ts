import express from "express";
import productRoutes from "./routes/product.js";
import dotenv from "dotenv";
import notFoundHandler from "./middlewares/notFound.js";
import serverErrorHandler from "./middlewares/serverError.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/v1", productRoutes);

// general error fallback
app.use(notFoundHandler);
app.use(serverErrorHandler);

app.listen(port, () => {
  console.log("Running on", port);
});
