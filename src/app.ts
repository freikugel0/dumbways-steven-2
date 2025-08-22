import express from "express";
import stockRoutes from "./routes/stock.js";
import dotenv from "dotenv";
import notFoundHandler from "./middlewares/not-found.js";
import serverErrorHandler from "./middlewares/server-error.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/v1", stockRoutes);

// general error fallback
app.use(notFoundHandler);
app.use(serverErrorHandler);

app.listen(port, () => {
  console.log("Running on", port);
});
