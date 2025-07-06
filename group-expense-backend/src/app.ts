import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Routes go here (will add soon)
app.get("/", (req, res) => {
  res.send("GroupExpense API running");
});

export default app;
