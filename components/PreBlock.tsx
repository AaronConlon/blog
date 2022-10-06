import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiOutlineSmile,
} from "react-icons/ai";
import { BsFillCircleFill, BsTerminal, BsTextCenter } from "react-icons/bs";
import {
  SiLua,
  SiNodedotjs,
  SiReact,
  SiRust,
  SiSwift,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import {
  TbBrandCss3,
  TbBrandHtml5,
  TbBrandPython,
  TbCopy,
} from "react-icons/tb";

import { DiSass } from "react-icons/di";
import { MotionDiv } from "./motion";
import SyntaxHighlighter from "react-syntax-highlighter";
import codeStyle from "@/styles/codeStyle";
import { useState } from "react";

const langMap = {
  css: <TbBrandCss3 />,
  bash: <BsTerminal />,
  html: <TbBrandHtml5 />,
  js: <SiNodedotjs />,
  ts: <SiTypescript />,
  javascript: <SiNodedotjs />,
  typescript: <SiTypescript />,
  node: <SiNodedotjs />,
  rust: <SiRust />,
  sass: <DiSass />,
  scss: <DiSass />,
  jsx: <SiReact />,
  tsx: <SiReact />,
  vue: <SiVuedotjs />,
  python: <TbBrandPython />,
  lua: <SiLua />,
  swift: <SiSwift />,
};

const CodeBlock = ({ className, children }) => {
  const [showCelebrateIcon, setShowCelebrateIcon] = useState(false);
  const onCopyCode = (e: HTMLElement) => {
    const parentElem = e.target.parentElement?.parentElement?.parentElement;
    if (parentElem) {
      const codeElem = parentElem.querySelector("code");
      if (codeElem?.textContent) {
        navigator.clipboard.writeText(codeElem?.textContent);
        setShowCelebrateIcon(true);
        setTimeout(() => {
          setShowCelebrateIcon(false);
        }, 2 * 1000);
      }
    }
  };
  let lang = "text"; // default monospaced text
  if (className && className.startsWith("lang-")) {
    lang = className.replace("lang-", "");
  }
  return (
    <details open className="py-6">
      <summary className="p-2 text-purple-500 select-none">查看详情</summary>
      <div
        style={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          margin: "0 0 2rem 0",
        }}
      >
        <div className="bg-[#222b5c] flex items-center p-2 text-white select-none gap-2 overflow-hidden">
          <AiFillMinusCircle />
          <BsFillCircleFill />
          <AiFillCloseCircle className="mr-auto scale-110 transform" />
          {showCelebrateIcon ? (
            <MotionDiv
              initial={{
                top: 10,
                opacity: 0,
              }}
              animate={{
                top: 0,
                opacity: 1,
              }}
              className="flex items-center gap-2 flex-grow justify-end relative h-4"
            >
              <p className="m-0 p-0 text-[12px] leading-[12px]">复制成功</p>
              <AiOutlineSmile />
            </MotionDiv>
          ) : (
            <MotionDiv
              onClick={onCopyCode}
              initial={{
                top: -10,
                opacity: 0,
              }}
              animate={{
                top: 0,
                opacity: 1,
              }}
              className="flex items-center gap-2 flex-grow justify-end relative h-4 cursor-pointer"
            >
              <TbCopy />
            </MotionDiv>
          )}
          {langMap[lang.toLowerCase()] ?? <BsTextCenter />}
        </div>
        <SyntaxHighlighter language={lang} style={codeStyle}>
          {children}
        </SyntaxHighlighter>
      </div>
    </details>
  );
};

const PreBlock = ({ children }) => {
  return CodeBlock(children["props"]);
  // if ("type" in children && children["type"] === "code") {

  // }

  // return (
  //   <div
  //     style={{
  //       boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  //       margin: "2rem 0",
  //     }}
  //   >
  //     <SyntaxHighlighter language="text" style={codeStyle}>
  //       {codeString}
  //     </SyntaxHighlighter>
  //   </div>
  // );
};

export default PreBlock;
