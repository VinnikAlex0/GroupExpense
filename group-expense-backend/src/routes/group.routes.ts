import express, { Request, Response } from "express";
import { createGroup } from "../controllers/group.controller";

const router = express.Router();

router.post("/groups", async (req: Request, res: Response) => {
  await createGroup(req, res);
});

export default router;
