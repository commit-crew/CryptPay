import { Router } from "express";

const appRouter = Router();

appRouter.post("/fetch_data", async (req, res) => {
  try {
    const data = req.body;
    const { mint } = data;
    const response = await fetch(process.env.ALCHEMY_API || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Required for JSON bodies
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-id",
        method: "getAsset",
        params: {
          id: mint,
        },
      }),
    });

    const respData = await response.json();
    console.log(respData);

    /// @ts-ignore
    const mintDecimals: string | undefined = respData.result.token_info.decimals;
    /// @ts-ignore
    const mintUrl: string | undefined = respData.result.content.files.uri;
    /// @ts-ignore
    const mintName: string | undefined = respData.result.content.metadata.name;
    /// @ts-ignore
    const mintSymbol: string | undefined = respData.result.content.metadata.symbol;

    return res.status(200).json({
        success: true,
        mintName,
        mintSymbol,
        mintUrl,
        mintDecimals
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
        success: false,
        message: errorMessage
    });
  }
});

export default appRouter;