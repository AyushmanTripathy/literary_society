import express, { ErrorRequestHandler } from "express";
import indexRouter from "./routes/index";
import { join } from "path";
import expressLayouts from "express-ejs-layouts";

const app = express();

app.set("views", join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.use("/static", express.static(join(__dirname, "../static")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

export default app;

