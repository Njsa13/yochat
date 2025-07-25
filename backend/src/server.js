import e from "express";
import cors from "cors";

import authRouter from "./routes/auth-route.js";

const app = e();
const PORT = process.env.BACKEND_PORT;

app.use(e.json());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});