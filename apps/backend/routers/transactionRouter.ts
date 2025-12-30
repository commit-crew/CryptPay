import { Router, type Request, type Response } from "express";
import { transactionHistory, usersTable } from "db/tables";
import { db, eq } from "db/connection";

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

transactionRouter.get("/history/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = "10" } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Get transaction history with user details
    const transactions = await db
      .select({
        id: transactionHistory.id,
        fromToken: transactionHistory.fromToken,
        toToken: transactionHistory.toToken,
        fromQuantity: transactionHistory.fromQuantity,
        toQuantity: transactionHistory.toQuantity,
        conversionRate: transactionHistory.conversionRate,
        status: transactionHistory.status,
        createdAt: transactionHistory.createdAt,
        userName: usersTable.name,
      })
      .from(transactionHistory)
      .innerJoin(usersTable, eq(transactionHistory.userId, usersTable.id))
      .where(eq(transactionHistory.userId, userId))
      .orderBy(transactionHistory.createdAt)
      .limit(parseInt(limit as string));

    return res.status(200).json({
      success: true,
      data: transactions,
      message: `Found ${transactions.length} transactions`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: errorMessage,
      success: false,
    });
  }
});

export default transactionRouter;
