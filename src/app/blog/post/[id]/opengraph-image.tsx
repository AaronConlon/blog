import { CONFIG } from "@/config";
import { getCacheIssues } from "@/features/cache";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({
  params: { id },
}: {
  params: { id: string };
}) {
  // Font
  const interSemiBold = await fetch(
    new URL("./public/Inter-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const issues = await getCacheIssues();
  const issue = issues.find((issue) => issue.id.toString() === id)!;

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {issue.title} - {issue.labels.map((label) => label.name).join(", ")} -{" "}
        {CONFIG.author.name} blog
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
