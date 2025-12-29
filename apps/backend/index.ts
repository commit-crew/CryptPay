import express from "express";
import userRouter from "./routers/userRouter";
import appRouter from "./routers/appRouter";
import transactionRouter from "./routers/transactionRouter";

const app = express();

app.use(express.json());
app.use("/app", appRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

app.listen(process.env.PORT || 3001, () => console.log(process.env.PORT));