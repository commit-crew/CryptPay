"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

const QRRecieve = ({
  name,
  publicAddress,
  setRecieveOpen,
}: {
  name: string;
  publicAddress: string;
  setRecieveOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    QRCode.toCanvas(ref.current, publicAddress, {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#000000",
        light: "#E5DBFF",
      },
      version: 8,
    });
  }, [publicAddress]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-evenly px-6">
      <div className="text-3xl flex gap-5">
        <Image
          src={"/images/left-arrow.svg"}
          alt=""
          width={25}
          height={25}
          className="cursor-pointer"
          onClick={() => setRecieveOpen(false)}
        />
        <div>Recieve</div>
      </div>
      <div className="bg-[#E5DBFF] flex flex-col items-center justify-evenly min-h-[60%] w-full rounded-4xl max-w-[330px]">
        <div className="flex gap-3 items-center">
          <Image
            src={"/images/profile-icon.jpg"}
            alt=""
            width={35}
            height={35}
            className="rounded-full"
          />
          <div className="text-xl">{name}</div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <canvas ref={ref} />
          <div className="text-sm">Scan to pay</div>
        </div>
        <div className="flex gap-3">
          <div className="text-xs">Wallet address: </div>
          <div className="text-xs w-[70px] overflow-x-scroll">
            {publicAddress}
          </div>
        </div>
      </div>
      <div className="flex gap-2 py-2 px-4 border border-black rounded-full">
        <Image src="/images/QR-icon.svg" alt="" width={20} height={20} />
        <div className="text-[#6750A4]">Open Scanner</div>
      </div>
    </div>
  );
};

export default QRRecieve;
