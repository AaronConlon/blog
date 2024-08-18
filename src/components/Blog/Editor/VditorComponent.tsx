import { resolveIssueBody } from "@/features/format";
import { ILocalIssue, TIssue } from "@/features/types";
import { useEffect, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import SelectLabels from "./SelectLabels";

interface VditorComponentProps {
  issue?: Partial<TIssue> | ILocalIssue;
  onPublish?: (options: Partial<TIssue>) => void;
}
export default function VditorComponent({
  issue,
  onPublish,
}: VditorComponentProps) {
  const [vd, setVd] = useState<Vditor>();
  const [title, setTitle] = useState(issue?.title ?? "");
  const [labels, setLabels] = useState(issue?.labels ?? []);

  useEffect(() => {
    const body = issue?.body ?? "";
    const { data, content } = resolveIssueBody(body);
    if (vd === undefined) {
      const vditor = new Vditor("vditor", {
        after: () => {
          vditor.setValue(content);
          setVd(vditor);
        },
        height: "100%",
      });
    } else {
      vd.setValue(content);
    }
  }, [issue]);

  return (
    <div className="h-screen">
      <div>
        <input
          className="w-full block px-1 border-none !border-b outline-none shadow-sm m-2"
          value={title}
          onChange={(e) => {
            const value = e.target.value;
            setTitle(value);
          }}
        />
        <div className="m-2 w-[360px]">
          <SelectLabels
            labels={issue?.labels ?? []}
            onChange={(e) => {
              console.log("change...", e);
            }}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-200px)]">
        <div id="vditor" className="vditor "></div>
      </div>
    </div>
  );
}
