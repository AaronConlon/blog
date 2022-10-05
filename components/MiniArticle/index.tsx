import CustomImage from "../CustomImage";
import { IGithubIssue } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import Markdown from "markdown-to-jsx";
import clsx from "clsx";
import { format } from "date-fns";

function MiniArticle({
  labels,
  title,
  updated_at,
  description,
  cover,
}: IGithubIssue) {
  return (
    <div className="flex flex-col items-stretch">
      <Markdown>{cover}</Markdown>
      <div className="p-4 flex flex-col flex-grow  rounded-md">
        <h3 className="font-bold text-xl">{title}</h3>
        <Markdown className="flex-grow p-4 py-12 text-gray-600">
          {description}
        </Markdown>
        <div className="flex gap-2">
          <span className="text-sm opacity-40 self-end">
            {format(new Date(updated_at), "yyyy年MM月dd HH:mm:ss")}
          </span>
          <div className="flex gap-2 flex-wrap justify-end items-center flex-grow">
            {labels.map(({ id, name, color }) => (
              <div
                key={id}
                className={clsx(
                  "px-2 py-1 italic  text-white rounded-md opacity-80 hover:opacity-100 hover:bg-purple-600 hover:text-light-100 text-sm transition-all"
                )}
                style={{ backgroundColor: `#${color}` }}
              >
                # {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiniArticle;
