import express from "express";
import rootRoute from "./routes/root";
import downloadRoute from "./routes/download";
import searchRoute from "./routes/search";
const v1 = express.Router();

v1.use("/", rootRoute);
v1.use("/music/search", searchRoute);
v1.use("/music/download", downloadRoute);
export default v1;
