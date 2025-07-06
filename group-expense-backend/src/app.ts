import express from "express";
import cors from "cors";
import groupRoutes from "./routes/group.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", groupRoutes);

app.get("/", (_req, res) => {
  res.send("GroupExpense API running");
});

export default app;
