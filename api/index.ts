import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, description: "bot working" });
});

app.listen(PORT, () => {
  console.log(`on port ${PORT}`);
});
