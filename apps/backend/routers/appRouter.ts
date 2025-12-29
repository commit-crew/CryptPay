import { Router, type Request, type Response } from "express";

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
    /// @ts-ignore
    console.log(respData.result.content.files);

    /// @ts-ignore
    const mintDecimals: number | undefined = respData.result.token_info.decimals;
    /// @ts-ignore
    const mintUrl: string | undefined = respData.result.content.files[0].uri;
    /// @ts-ignore
    const mintName: string | undefined = respData.result.content.metadata.name;
    /// @ts-ignore
    const mintSymbol: string | undefined = respData.result.content.metadata.symbol;

    return res.status(200).json({
      success: true,
      mintName: mintName ? mintName : "Unknown",
      mintSymbol: mintSymbol ? mintSymbol : "None",
      mintUrl: mintUrl ? mintUrl : "None",
      mintDecimals: mintDecimals ? mintDecimals : 0,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
});

appRouter.post("/get_qoute", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { inputMint, outputMint, targetAmount, reciever } = data;
    const apiKeys = process.env.JUP_API_KEY!.split(",");
    const randInd = Math.floor(Math.random() * 4);

    const options = {
      method: "GET",
      headers: { "x-api-key": apiKeys[randInd]! },
    };

    const response = await fetch(
      `https://api.jup.ag/ultra/v1/order?inputMint=${inputMint}&outputMint=${outputMint}&amount=${targetAmount}&reciever=${reciever}&swapMode=ExactOut`,
      options
    );

    const respData = await response.json();
    console.log(respData);

    res.status(200).json({
      success: true,
      message: "Got qoute",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
  //   {
  //   inputMint: "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
  //   outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  //   inAmount: "1116215006",
  //   outAmount: "10500000",
  //   otherAmountThreshold: "1116215006",
  //   swapMode: "ExactOut",
  //   slippageBps: 0,
  //   priceImpactPct: "-0.0024431190107491434",
  //   routePlan: [
  //     {
  //       percent: 100,
  //       bps: 10000,
  //       usdValue: 10.500458825439411,
  //       swapInfo: [Object ...],
  //     }
  //   ],
  //   feeBps: 10,
  //   transaction: null,
  //   gasless: true,
  //   signatureFeeLamports: 10000,
  //   signatureFeePayer: null,
  //   prioritizationFeeLamports: 0,
  //   prioritizationFeePayer: null,
  //   rentFeeLamports: 0,
  //   rentFeePayer: null,
  //   requestId: "1b1380c9-27e7-dc5f-6f00-d1d17634e222",
  //   swapType: "rfq",
  //   router: "jupiterz",
  //   quoteId: "ede6454c-4920-515e-ba60-4d0c422a7639",
  //   maker: "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
  //   taker: null,
  //   expireAt: null,
  //   platformFee: {
  //     amount: "1116215",
  //     feeBps: 10,
  //   },
  //   inUsdValue: 10.52617552497496,
  //   outUsdValue: 10.500458825439411,
  //   swapUsdValue: 10.500458825439411,
  //   priceImpact: -0.24431190107491435,
  //   mode: "manual",
  //   totalTime: 546,
  // }
  
});

export default appRouter;
