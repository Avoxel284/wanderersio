import express from "express";

export const router = express.Router();

// /api/v1/AU?gamemode=sandbox
router.get("/play/:region", async (req, res) => {});

router.get("/changes", async (req, res) => {
	res.send({ changes: [{ prefix: "+", text: "Hello!" }], new: true });
});

export default router;
