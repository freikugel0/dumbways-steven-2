import express from "express";
import dotenv from "dotenv";
import notFoundHandler from "./middlewares/not-found.js";
import serverErrorHandler from "./middlewares/server-error.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);

// general error fallback
app.use(notFoundHandler);
app.use(serverErrorHandler);

app.listen(port, () => {
  console.log("Running on", port);
});
