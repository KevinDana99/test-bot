import express, { Request, Response } from "express";
import ScrapingService from "../../services/ScrapingService/";

const route = express.Router();

route.get("/", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const searchResults = await ScrapingService.search(query);
    return res.json(searchResults);
  } catch (err) {
    if (err instanceof Error) {
      return res
        .status(500)
        .json({ message: err.message, statusCode: err.name });
    }
  }
});

export default route;
