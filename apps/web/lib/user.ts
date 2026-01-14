"use server";

import { User } from "./types";

export const signIn = async (email: string, password: string) => {
  try {
    const resp = await fetch(process.env.NEXT_PRIVATE_BACKEND_URL! + "/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password })
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.message || "Sign in failed");
    }

    return data; // { message: token, success: true }
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signUp = async (name: string, email: string, password: string, publicKey: string) => {
  try {
    const resp = await fetch(process.env.NEXT_PRIVATE_BACKEND_URL! + "/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, publicAddress: publicKey })
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.message || "Sign up failed");
    }

    return data; // { message: email, success: true }
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const searchUsers = async (name: string, token: string) => {
  try {
    const resp = await fetch(process.env.NEXT_PRIVATE_BACKEND_URL! + `/user/search?name=${encodeURIComponent(name)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: process.env.NEXT_PUBLIC_FRONTEND_URL!,
        Authorization: token
      }
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.message || "Search failed");
    }

    return data; // { success: true, data: users[], message: string }
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

export const getTransactionHistory = async (token: string, limit: number = 10) => {
  try {
    const resp = await fetch(process.env.NEXT_PRIVATE_BACKEND_URL! + `/transaction/history?limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Origin: process.env.NEXT_PUBLIC_FRONTEND_URL!,
        Authorization: token
      }
    });

    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.message || "Failed to fetch transaction history");
    }

    return data; // { success: true, data: transactions[], message: string }
  } catch (error) {
    console.error("Transaction history error:", error);
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    console.log("Verifying token with backend:", process.env.NEXT_PRIVATE_BACKEND_URL);
    
    const resp = await fetch(process.env.NEXT_PRIVATE_BACKEND_URL! + "/user/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: process.env.NEXT_PUBLIC_FRONTEND_URL!,
        Authorization: token
      }
    });

    console.log("Response status:", resp.status);
    console.log("Response headers:", resp.headers);

    // Check if response is HTML (error page)
    const contentType = resp.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await resp.text();
      console.error("Non-JSON response:", text);
      throw new Error("Backend server is not responding correctly. Please check if the backend is running.");
    }

    const data = await resp.json();
    
    if (!resp.ok) {
      throw new Error(data.message || "Token verification failed");
    }

    return data; // { success: true, data: user, message: string }
  } catch (error) {
    console.error("Token verification error:", error);
    
    // If it's a network error, provide a helpful message
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Cannot connect to backend server. Please ensure the backend is running on http://localhost:3001");
    }
    
    throw error;
  }
};

export const verifyValidAccountHolder = async (publicAddress: string, token: string) => {
  try {
    const respDB = await fetch(`${process.env.NEXT_PRIVATE_BACKEND_URL}` + "/address", {
      headers: {
        "Content-type": "application/json",
        Origin: process.env.NEXT_PUBLIC_FRONTEND_URL!,
        Authorization: token
      },
      body: JSON.stringify({ address: publicAddress })
    });

    const data = await respDB.json() as { success: boolean, data: User | undefined, message: string | undefined }
    if(data.success) {
      return {
        ...data.data!
      }
    }
    
    // If no data of user in our DB just check valid solana address using alchemy getAccountInfo.
    const respRPC = await fetch();
  } catch (error) {
    
  }
}
