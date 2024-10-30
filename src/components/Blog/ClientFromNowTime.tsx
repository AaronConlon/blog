"use client"

import { formatTimeFromNow } from "@/features/format";

export default function ClientFromNowTime({ updated_at }: {
  updated_at: string;
}) {


  return <>
    {
      formatTimeFromNow(updated_at)
    }
  </>
}