import { Response } from "express";

export function handleError(res: Response, e: any) {
  console.error(e);
  res.send("Oops! Something ain't right.");
}
