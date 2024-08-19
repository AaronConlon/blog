"use client";

import { localTokenAtom } from "@/features/atom";
import { useAtomValue } from "jotai";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";

interface EditEntryProps {
  issueNumber: number;
}

export default function EditEntry({ issueNumber }: EditEntryProps) {
  const local = useAtomValue(localTokenAtom);
  if (local?.length) {
    return (
      <Link
        href={`/blog/editor?issueNumber=${issueNumber}`}
        className="opacity group-hover:opacity-100 transition-opacity"
      >
        <Edit2Icon />
      </Link>
    );
  }
  return null;
}
