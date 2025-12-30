"use client";

import { toast as sonnerToast } from "sonner";
import { numanFont } from "@/app/fonts";
import type { ToastProps } from "@/lib/types";

export default function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast id={id} title={toast.title} description={toast.description} />
  ));
}

function Toast(props: ToastProps) {
  const { title } = props;

  return (
    <div className="h-[60px] w-[250px] bg-[#6750A4] flex flex-col justify-center items-center rounded-full">
      <div className={`text-[#FFF8F1] ` + numanFont.className}>{title}</div>
    </div>
  );
}
