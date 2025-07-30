import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";	
import { clerkMiddleware } from "@clerk/express";

import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";


const PORT = process.env.PORT || 10000;
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


app.get("/", (req, res) => {
	res.send("server is live");
});
app.use("/api/inngest", serve({ client: inngest, functions }));

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`server is running on port ${PORT}`);
	});
};

startServer();
