import express from "express";
import path from "path";
import api from "./api/index.ts";
import cors from "cors";
import helmet from "helmet";

const app = express();
const __dirname = import.meta.dirname;

app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/api/v1/", api);

app.get("/", async (req, res) => {
	res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

app.use("/static", async (req, res, next) => {
	express.static(path.resolve(`${__dirname}/../public`), {
		maxAge: "2d",
	})(req, res, next);
});

app.listen(8030, "localhost", () => {
	console.log("Listening at http://localhost:8030");
});
