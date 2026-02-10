import { Express } from "express";
import v1 from "./v1";
import rootRoute from "./v1/routes/root";
const router = (app: Express) => {
  app.use("/", rootRoute);
  app.use("/api/v1", v1);
};

export default router;
