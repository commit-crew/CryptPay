"use client";

import { use, useEffect } from "react";

const PayPage = ({ params }: { params: Promise<{ reciever: string | null }> }) => {
  const { reciever } = use(params);
  useEffect(() => {
    const checkValidAccountHolder = async () => {}
    checkValidAccountHolder()
  }, [])
  return (
    <div>{reciever}</div>
  )
}

export default PayPage;