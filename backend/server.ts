import express from "express";
import path from "path";
import api from "./api/index.ts";
import cors from "cors";
import helmet from "helmet";

const app = express();
const __dirname = import.meta.dirname;

app.use(cors({ origin: "*" }));
app.use(helmet({ contentSecurityPolicy: { directives: { "script-src": ["'unsafe-eval'", "'self'"] } } }));

app.use("/api/v1/", api);

app.get("/client/server/:region/:mode/:id", (req, res) => {
	res.send("s1");
});

app.use("/", async (req, res, next) => {
	express.static(path.resolve(`${__dirname}/../dist`), {
		maxAge: "2d",
		index: "index.html",
	})(req, res, next);
});

app.listen(8030, "localhost", () => {
	console.log("Listening at http://localhost:8030");
});
