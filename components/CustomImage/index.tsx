import { useEffect, useRef, useState } from "react";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbFaceIdError } from "react-icons/tb";
import clsx from "clsx";
import { motion } from "framer-motion";
import styles from "./index.module.scss";

interface IProps {
  src: string;
  width: number | string;
  height: number | string;
  alt?: string;
}

function CustomImage({ src, width, height, alt = "cover image" }: IProps) {
  const boxRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [_src, set_src] = useState("");
  const [isError, setIsError] = useState(false);

  const imageLoaded = () => {
    setIsLoading(false);
  };

  const imageError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  useEffect(() => {
    // 观察当前容器是否可见，不可见则不加载图片
    const observe = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio > 0) {
        set_src(src);
      }
    });
    observe.observe(boxRef.current!);
    return () => {
      observe.disconnect();
    };
  }, [set_src, src]);

  return (
    <motion.div
      style={{
        maxWidth: `${width}px`,
        minWidth: `${width}px`,
        maxHeight: `${height}px`,
        minHeight: `${height}px`,
        background: `${isLoading || isError ? "#eee" : "unset"}`,
      }}
      ref={boxRef}
      className="flex items-center justify-center"
    >
      {/* loading */}
      {isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
      {isError && (
        <div className="flex gap-2 justify-center items-center">
          <TbFaceIdError />
          <p>图片迷路了</p>
        </div>
      )}
      {!isError && (
        <img
          style={{
            display: isLoading ? "none" : "unset",
            height: `${height}px`,
            width: `${width}px`,
          }}
          alt={alt}
          src={_src}
          onLoad={imageLoaded}
          onError={imageError}
        />
      )}
    </motion.div>
  );
}

export default CustomImage;
