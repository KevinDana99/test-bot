import express, { Request, Response } from "express";
import ScrapingService from "../../services/ScrapingService";

const route = express.Router();

route.get("/", async (req: Request, res: Response) => {
  try {
    const { artist, title } = req.query;
    if (!artist || !title) {
      return res.status(400).send("Faltan parámetros artist o title");
    }

    const stream = await ScrapingService.download(
      artist as string,
      title as string
    );

    if (!stream) {
      console.error("❌ No se pudo obtener el stream de downloadService");
      return res.status(404).send("No se pudo obtener el audio");
    }
    return res.status(200).json(stream);
  } catch (globalError) {
    console.error("❌ Error crítico en el endpoint:", globalError);
    if (!res.headersSent) {
      res.status(500).send("Error interno del servidor");
    }
  }
});

export default route;
