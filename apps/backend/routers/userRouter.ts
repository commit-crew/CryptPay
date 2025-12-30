import { db, eq, like } from "db/connection";
import bcrypt from "bcrypt";
import { Router } from "express";
import { usersTable } from "db/tables";
import jwt from "jsonwebtoken";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const { email, password, name, publicAddress } = data;

    if (!email || !password || !name || !publicAddress)
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
      });

    const existingUser = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0)
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
        publicAddress,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
      });

    return res.status(201).json({
      success: true,
      message: newUser?.email
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: errorMessage,
      success: false,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Invalid inputs",
      });

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length == 0) {
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    const user = existingUser[0];

    const decryptedPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );
    const token = jwt.sign(
      {
        email,
        userId: user?.id,
      },
      process.env.JWT_SECRET || ""
    );
    if (!decryptedPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    res.status(200).json({
      message: token,
      success: true,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: errorMessage,
      success: false,
    });
  }
});

userRouter.get("/search", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Name query parameter is required",
      });
    }

    // Search for users by name (case-insensitive partial match)
    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        publicAddress: usersTable.publicAddress,
      })
      .from(usersTable)
      .where(like(usersTable.name, `%${name}%`))
      .limit(10); // Limit results to prevent large responses

    return res.status(200).json({
      success: true,
      data: users,
      message: `Found ${users.length} users`,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: errorMessage,
      success: false,
    });
  }
});

userRouter.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { email: string; userId: string };

    // Get user details from database
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

    return res.status(200).json({
      success: true,
      data: user[0],
      message: "Token verified successfully",
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: errorMessage,
      success: false,
    });
  }
});

export default userRouter;
