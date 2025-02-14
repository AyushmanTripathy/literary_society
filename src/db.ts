import mongoose from "mongoose";

export function initConnection() {
  console.log("connecting with mongo at", process.env.DB_URL);
  mongoose.connect(process.env.DB_URL || "");
  const db = mongoose.connection;
  db.on("error", console.error);
  db.once("open", () => console.log("Connected with mongodb"))
}

