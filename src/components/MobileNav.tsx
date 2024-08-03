"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sm:hidden mr-2 cursor-pointer">
      <Menu
        className="w-8 h-8 text-primary dark:text-[#1f2e3a] group-hover:text-primary dark:group-hover:text-primary"
        onClick={() => setOpen(!open)}
      />

      <ul
        onClick={() => setOpen(false)}
        className="absolute top-0 left-0 right-0 w-full bg-white p-4 list-item list-disc pl-12 overflow-hidden"
        style={{
          transition: "0.5s max-height ease-in-out",
          zIndex: "-1",
          maxHeight: open ? "190px" : "0",
        }}
      >
        <li className="pt-12">
          <a href="#doing-lately">What am I doing lately?</a>
        </li>
        <li>
          <a href="#blog">Blog</a>
        </li>
        <li>
          <a href="#projects">Projects</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </div>
  );
}
