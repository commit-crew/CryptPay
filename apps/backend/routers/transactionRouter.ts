import { Router, type Request, type Response } from "express";
import { transactionHistory } from "db/tables";
import { db } from "db/connection";

const transactionRouter = Router();

transactionRouter.post("/process", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const {
      status,
      fromToken,
      toToken,
      fromQuantity,
      toQuantity,
      conversionRate,
      userId
    }: {
      status: string;
      fromToken: string;
      toToken: string;
      fromQuantity: string;
      toQuantity: string;
      conversionRate: string;
      userId: string
    } = data;

    const newtransaction: typeof transactionHistory.$inferInsert = {
      status,
      fromToken,
      toToken,
      fromQuantity,
      toQuantity,
      conversionRate,
      userId
    };

    const transId = await db.insert(transactionHistory).values(newtransaction).returning({
      id: transactionHistory.id,
    });

    return res.status(201).json({
        message: transId[0]?.id,
        success: true
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error."
    return res.status(500).json({
        message: errorMessage,
        success: true
    })
  }
});

export default transactionRouter;
