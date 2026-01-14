import jwt from "jsonwebtoken";
import { db, eq } from "db/connection";
import { usersTable } from "db/tables";
import type { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      authHeader === "null" ||
      authHeader === "undefined" ||
      authHeader.trim() === ""
    ) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(
      authHeader,
      process.env.JWT_SECRET!
    ) as { email: string; userId: string };

    const user = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        publicAddress: usersTable.publicAddress,
      })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId));

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      id: user[0]!.id,
      name: user[0]!.name,
      email: user[0]!.email,
      publicAddress: user[0]!.publicAddress,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};