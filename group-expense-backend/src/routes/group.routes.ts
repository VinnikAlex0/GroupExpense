import express, { Request, Response } from "express";
import { createGroup, getGroups } from "../controllers/group.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

// POST /groups - Create a new group (requires authentication)
router.post(
  "/groups",
  authenticateUser,
  async (req: Request, res: Response) => {
    await createGroup(req, res);
  }
);

// GET /groups - Get user's groups (requires authentication)
router.get("/groups", authenticateUser, async (req: Request, res: Response) => {
  await getGroups(req, res);
});

export default router;
