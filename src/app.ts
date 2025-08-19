import express from "express";
import postRoutes from "./routes/post-route.js";

const app = express();
const port = 3000;

app.use("/api/v1", postRoutes);

app.listen(port, () => {
  console.log("Running on", port);
});
