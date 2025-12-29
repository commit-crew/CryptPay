import { Numans, Poppins } from "next/font/google";

export const numanFont = Numans({
  subsets: ["latin"],
  weight: "400",
});

export const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
