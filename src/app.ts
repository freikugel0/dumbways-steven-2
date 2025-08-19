import express from "express";
import productRoutes from "./routes/product-route.js";
import orderRoutes from "./routes/order-route.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/v1", productRoutes);
app.use("/api/v1", orderRoutes);

app.listen(port, () => {
  console.log("Running on", port);
});
