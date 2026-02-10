import initBot from "@/bot";
import { bot } from "@/bot/config";
import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  try {
    res.status(200).json({ status: 200, description: "bot working" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        status: 500,
        description: "bot not working",
        message: err.message,
        error: err.name,
      });
    }
  }
});

app.listen(PORT, () => {
  initBot(bot);
  console.log(`on port ${PORT}`);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
