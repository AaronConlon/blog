import { BsTerminal, BsTextCenter } from "react-icons/bs";
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
import SyntaxHighlighter from "react-syntax-highlighter";
import codeStyle from "@/styles/codeStyle";

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
  const onCopyCode = (e: HTMLElement) => {
    console.log("try to copy code!", e);

    const parentElem = e.target.parentElement?.parentElement;
    if (parentElem) {
      const codeElem = parentElem.querySelector("code");
      if (codeElem?.textContent) {
        navigator.clipboard.writeText(codeElem?.textContent);
      }
    }
  };
  let lang = "text"; // default monospaced text
  if (className && className.startsWith("lang-")) {
    lang = className.replace("lang-", "");
  }
  return (
    <div
      style={{
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        margin: "2rem 0",
      }}
    >
      <div className="bg-purple-600 flex items-center justify-between p-1 px-2 text-white select-none">
        {langMap[lang.toLowerCase()] ?? <BsTextCenter />}
        <TbCopy onClick={onCopyCode} className="cursor-pointer" />
      </div>
      <SyntaxHighlighter language={lang} style={codeStyle}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

const PreBlock = ({ children }) => {
  const codeString = "(num) => num + 1";
  console.log(children);
  if ("type" in children && children["type"] === "code") {
    return CodeBlock(children["props"]);
  }

  return (
    <div
      style={{
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        margin: "2rem 0",
      }}
    >
      <SyntaxHighlighter language="text" style={codeStyle}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default PreBlock;
