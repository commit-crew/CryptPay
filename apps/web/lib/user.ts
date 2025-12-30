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
