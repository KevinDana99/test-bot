import express from "express";
const rootRoute = express.Router();

rootRoute.get("/", (req, res) => {
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

export default rootRoute;
