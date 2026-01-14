"use client";

import { verifyValidAccountHolder } from "@/lib/user";
import { use, useEffect, useState } from "react";

const PayPage = ({ params }: { params: Promise<{ reciever: string | undefined }> }) => {
  const { reciever } = use(params);
  const [ validating, setvalidating ] = useState(true);
  useEffect(() => {
    const checkValidAccountHolder = async () => {
      if(!reciever) return;
      const token = localStorage.getItem("authToken");
      const check = verifyValidAccountHolder(reciever, token!);
    }
    checkValidAccountHolder()
  }, [reciever])
  return (
    <div>{reciever}</div>
  )
}

export default PayPage;