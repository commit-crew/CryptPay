"use server";

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
