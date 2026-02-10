import { Express } from "express";
import v1 from "./v1";
const router = (app: Express) => {
  app.use("/api/v1", v1);
};

export default router;
