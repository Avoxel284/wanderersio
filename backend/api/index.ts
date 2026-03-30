import express from "express";
import crypto from "crypto";

export const router = express.Router();

// /api/v1/AU?gamemode=sandbox
router.get("/play/:region", async (req, res) => {});

router.get("/notices", async (req, res) => {
	const changes = [
		{ title: "Welcome!", body: "hi" },
		{ title: "Welcome!", body: "hi" },
	];
	const changesHash = crypto.createHash("md5").update(JSON.stringify(changes)).digest("hex");

	res.send({ changes, changesHash, news: {}, newNews: false });
});

export default router;
