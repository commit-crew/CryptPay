"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";

const QR = ({ publicAddress }: { publicAddress: string }) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    QRCode.toCanvas(ref.current, publicAddress, {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      version: 8,
    });
  }, [publicAddress]);

  return (
    <div className="absolute inset-0 bg-red-300 flex items-center justify-center">
      <canvas ref={ref} />
    </div>
  );
};

export default QR;
