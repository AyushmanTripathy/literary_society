
const AUTH_KEY = process.env.AUTH_KEY || "";
if (!AUTH_KEY) {
  console.log("AUTH KEY not found");
  process.exit(1);
}
export { AUTH_KEY };
