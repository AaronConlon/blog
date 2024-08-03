"use client";

import { ITableContent } from "@/features/types";

interface FloatTableOfContentProps {
  tableContent: ITableContent[];
}

export default function FloatTableOfContent({
  tableContent,
}: FloatTableOfContentProps) {
  return (
    <aside className="fixed right-0 top-0 w-48 h-full bg-orange-50">
      <section
        className="text-primary section-leading text-lg font-semibold"
        data-type="highlight"
      >
        文章目录
      </section>
    </aside>
  );
}
