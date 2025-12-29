import express from "express";
import userRouter from "./routers/userRouter";
import appRouter from "./routers/appRouter";

const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/app", appRouter);

app.listen(process.env.PORT || 3001, () => console.log(process.env.PORT));