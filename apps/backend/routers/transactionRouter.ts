import { Router, type Request, type Response } from "express";
import { transactionHistory, usersTable } from "db/tables";
import { db, eq } from "db/connection";
import { alias } from "drizzle-orm/pg-core";

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
      userId,
      toUserId
    }: {
      status: string;
      fromToken: string;
      toToken: string;
      fromQuantity: string;
      toQuantity: string;
      conversionRate: string;
      userId: string;
      toUserId: string;
    } = data;

    const newtransaction: typeof transactionHistory.$inferInsert = {
      status,
      fromToken,
      toToken,
      fromQuantity,
      toQuantity,
      conversionRate,
      userId,
      toUserId
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

    // Create aliases for the users table to join both fromUser and toUser
    const fromUser = alias(usersTable, 'fromUser');
    const toUser = alias(usersTable, 'toUser');

    // Get transaction history with both fromUser and toUser details
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
        userName: fromUser.name,
        toUserName: toUser.name,
        toUserEmail: toUser.email,
      })
      .from(transactionHistory)
      .innerJoin(fromUser, eq(transactionHistory.userId, fromUser.id))
      .innerJoin(toUser, eq(transactionHistory.toUserId, toUser.id))
      .where(eq(transactionHistory.userId, userId))
      .orderBy(transactionHistory.createdAt)
      .limit(parseInt(limit as string));

    // Transform the data to match the expected interface
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      fromToken: transaction.fromToken,
      toToken: transaction.toToken,
      fromQuantity: transaction.fromQuantity,
      toQuantity: transaction.toQuantity,
      conversionRate: transaction.conversionRate,
      status: transaction.status,
      createdAt: transaction.createdAt,
      userName: transaction.userName,
      toUser: {
        name: transaction.toUserName,
        email: transaction.toUserEmail,
      }
    }));

    return res.status(200).json({
      success: true,
      data: transformedTransactions,
      message: `Found ${transformedTransactions.length} transactions`,
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
