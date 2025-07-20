import express, { Request, Response } from "express";
import { createGroup, getGroups } from "../controllers/group.controller";

const router = express.Router();

router.post("/groups", async (req: Request, res: Response) => {
  await createGroup(req, res);
});

router.get("/groups", async (req: Request, res: Response) => {
  await getGroups(req, res);
});

export default router;
