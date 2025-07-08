"use client";

import { TLabel } from "@/features/types";
import { WrapText } from "lucide-react";
import { useState } from "react";

interface IMobileMenuProps {
  labels: TLabel[];
}

export default function MobileMenu({ labels }: IMobileMenuProps) {
  const [showList, setShowList] = useState(false);

  const onShowList = () => {
    setShowList((prev) => !prev);
  };

  return (
    <div className="sm:hidden ml-2">
      <span className="animate-jump-out"></span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onShowList();
        }}
        className="flex justify-center items-center"
      >
        <WrapText className="text-primary" />
      </button>
      {showList && (
        <div className="flex gap-2 animate-fade-down absolute inset-x-0 w-full top-14 bg-white p-2 shadow-md justify-center items-center pb-8">
          {labels.map(({ name, id, color }) => (
            <div
              key={id}
              className="px-1 rounded-s"
              style={{
                color: `#${color}`,
                backgroundColor: `#${color}1a`,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
