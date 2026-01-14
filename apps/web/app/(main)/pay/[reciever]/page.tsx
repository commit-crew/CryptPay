"use client";

import { use } from "react";

const PayPage = ({ params }: { params: Promise<{ reciever: string | null }> }) => {
  const { reciever } = use(params);
  return (
    <div>{reciever}</div>
  )
}

export default PayPage;