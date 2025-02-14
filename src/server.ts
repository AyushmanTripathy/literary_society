import { config } from "dotenv";
config();

import { initConnection } from "./db";
import app from "./app";

initConnection();
app.listen(process.env.PORT, () => {
  console.log("Listening on port", process.env.PORT);
})
