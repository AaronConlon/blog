"use client";

import Image from "next/image";
import { useState } from "react";

type OpenSourceProjectCoverProps = {
  src: string;
  alt: string;
};

export default function OpenSourceProjectCover({
  src,
  alt,
}: OpenSourceProjectCoverProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative aspect-[315/161] w-full overflow-hidden bg-primary/5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 122, 122, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 122, 122, 0.12) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,122,122,0.16),transparent_58%)]" />
      {!hasError && (
        <Image
          src={src}
          alt={alt}
          className={[
            "relative z-10 h-full w-full object-cover transition-opacity duration-500 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
          width={315}
          height={161}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
