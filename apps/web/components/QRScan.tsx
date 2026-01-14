"use client";

import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

const QRScan = ({ setScanOpen }: { setScanOpen: Dispatch<SetStateAction<boolean>> }) => {
  const router = useRouter();
  return (
    <div className='fixed top-0 left-0 w-screen h-screen z-50'>
      <Scanner
        onScan={(result) => {
          if (result?.[0]?.rawValue) {
            const reciever = result[0].rawValue;
            setScanOpen(false);
            router.push(`/pay/${reciever}`);
          }
        }}
        components={{
          onOff: true,
          torch: true,
          finder: true,
        }}
        sound={false}
        classNames={{
          container: "h-full w-full",
          video: "h-full w-full object-cover"
        }}
      />
    </div>
  );
};

export default QRScan;