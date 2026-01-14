import cors from "cors";
import express from "express";
import appRouter from "./routers/appRouter";
import userRouter from "./routers/userRouter";
import transactionRouter from "./routers/transactionRouter";

const app = express();

app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Origin"],
    })
  );
app.use(express.json());
app.use("/app", appRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

app.listen(process.env.PORT || 3001, () => console.log(process.env.PORT));