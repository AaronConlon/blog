/* eslint-disable */
import React, { useState } from "react";
// eslint-disable-next-line import/extensions
import copyText from "../help/copy";
import sd from "../styles/CopyCode.module.sass";

interface IProps {
  text: string;
}
export default function CodeCopy({ text }: IProps) {
  const [isCopy, setIsCopy] = useState(false);
  const handleCopyAction = async () => {
    const { success } = await copyText(text);
    setIsCopy(success);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };
  return (
    <div className={isCopy ? sd.ok : sd.normal}>
      {isCopy ? (
        <svg
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
        >
          <path
            d="M5 7.5l2 2 3.5-4m0-5h-8a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1v-10l-3-3z"
            stroke="currentColor"
          />
        </svg>
      ) : (
        <div onClick={handleCopyAction} style={{ cursor: "pointer" }}>
          <svg
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
          >
            <path
              d="M11 1.5h2.5v12a1 1 0 01-1 1h-10a1 1 0 01-1-1v-12H4m.5-1h6v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z"
              stroke="currentColor"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
