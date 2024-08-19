import { createIssue, updateIssue } from "@/features/api";
import { localIssuesAtom, localTokenAtom } from "@/features/atom";
import { formatTimeFromNow, resolveIssueBody } from "@/features/format";
import { ILocalIssue, TIssue, TLabel } from "@/features/types";
import { useAtomValue, useSetAtom } from "jotai";
import { uniqBy } from "lodash-es";
import { Calendar } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Vditor from "vditor";
import "vditor/dist/index.css";
import SelectLabels from "./SelectLabels";

interface VditorComponentProps {
  issue?: Partial<TIssue> | ILocalIssue;
  labels: TLabel[];
  isLocalIssue: boolean;
  setIssues: Dispatch<SetStateAction<Partial<TIssue>[]>>;
}
export default function VditorComponent({
  issue,
  labels,
  isLocalIssue,
  setIssues,
}: VditorComponentProps) {
  const [vd, setVd] = useState<Vditor>();
  const [title, setTitle] = useState(issue?.title ?? "");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [newLabels, setNewLabels] = useState(issue?.labels ?? []);
  const setLocalIssues = useSetAtom(localIssuesAtom);
  const token = useAtomValue(localTokenAtom);
  // @ts-ignore
  const [state, setState] = useState(issue?.state ?? "open");

  useEffect(() => {
    const body = issue?.body ?? "";
    const { data, content } = resolveIssueBody(body);
    if (vd === undefined) {
      const vditor = new Vditor("vditor", {
        outline: {
          enable: true,
          position: "left",
        },
        mode: "wysiwyg",
        preview: {
          hljs: {
            lineNumber: true,
            defaultLang: "javascript",
          },
        },
        after: () => {
          // 仅初始化时设置
          if (!vd) {
            vditor.setValue(content);
            if (isLocalIssue) {
              // @ts-ignore
              setDescription(issue?.description ?? "");
              // @ts-ignore
              setCover(issue?.cover ?? "");
            } else {
              if (data?.description) {
                setDescription(data.description);
              }
              if (data?.cover) {
                setCover(data.cover);
              }
            }
          }
          setVd(vditor);
        },
        height: "100%",
        cache: {
          enable: false,
        },
        counter: {
          enable: true,
        },
        input: () => {
          if (isLocalIssue) {
            // 每次都同步数据到 storage
            setLocalIssues((prev) =>
              prev.map((i) => {
                if (i.number === issue?.number) {
                  return {
                    ...i,
                    body: vditor.getValue(),
                  };
                }
                return i;
              })
            );
          }
        },
      });
    } else {
      vd.setValue(content);
      setTitle(issue?.title ?? "");
      setDescription(data?.description ?? "");
      setNewLabels(issue?.labels ?? []);
      setCover(data?.cover ?? "");
    }
  }, [issue, isLocalIssue]);

  useEffect(() => {
    if (isLocalIssue) {
      setLocalIssues((prev) =>
        prev.map((i) => {
          if (i.number === issue?.number) {
            return {
              ...i,
              title,
              description,
              cover,
              labels: newLabels,
            };
          }
          return i;
        })
      );
    }
  }, [isLocalIssue, title, description, cover, newLabels]);

  const onPublish = async () => {
    // 根据是否是本地的数据，来重组 body
    try {
      let body = vd?.getValue() ?? "";
      body = `---\ndescription: ${description}\ncover: ${cover}\n---\n${body}`;
      if (isLocalIssue) {
        const newIssue = {
          title,
          body,
          labels: newLabels.map((i) => i.name),
        };
        console.log(token);
        const newIssueData = await createIssue(newIssue, token!);
        setIssues((prev) => uniqBy([...prev, newIssueData], "number"));
      } else {
        // 更新 issue
        const newIssue = {
          title,
          body,
          labels: newLabels.map((i) => i.name),
        };
        const updateData = await updateIssue(newIssue, issue?.number!, token!);
        setIssues((prev) =>
          prev.map((i) => {
            if (i.number === issue?.number) {
              return updateData;
            }
            return i;
          })
        );
        // rebuild blog
        fetch(
          "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/16710477-1a3d-4b98-9a4e-173df1f073f5",
          {
            method: "POST",
          }
        );
      }
      toast.success("发布成功");
    } catch (error) {
      toast.error("发布失败");
    }
  };

  return (
    <div className="h-screen max-w-[1260px]">
      <div>
        <div className="relative grid grid-cols-[48px_auto_160px] items-center m-2">
          <span className="px-2 py-1 rounded-md text-center text-md text-primary font-semibold mt-1">
            标题
          </span>
          <input
            className="block p-1 mb-1 !border-b outline-none shadow-sm m-2"
            value={title}
            onChange={(e) => {
              const value = e.target.value;
              setTitle(value);
            }}
          />

          <div className="flex items-center gap-2 absolute translate-y-[-50%] right-2 top-[50%]">
            {!isLocalIssue && (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setState(state === "open" ? "closed" : "open");
                  const newIssue = await updateIssue(
                    {
                      state: state === "open" ? "closed" : "open",
                    },
                    issue?.number!,
                    token!
                  );
                  setIssues((prev) =>
                    prev.map((i) => {
                      if (i.number === issue?.number) {
                        return newIssue;
                      }
                      return i;
                    })
                  );
                }}
                className="border-primary/60 border text-primary px-2 py-1 rounded-md font-thin text-sm"
              >
                {state === "open" ? "⚠️ 关闭" : "🚄 打开"}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onPublish();
              }}
              className="border-primary/60 border text-primary px-2 py-1 rounded-md font-thin text-sm"
            >
              🚀 发布
            </button>
          </div>
        </div>
        <div className="flex">
          <div className="m-2 w-[600px]">
            <SelectLabels
              labels={labels}
              onChange={(e: string[]) => {
                console.log("change...", e);
                setNewLabels(
                  e.map((i) => labels.find((label) => label.name === i)!)
                );
              }}
              defaultLabels={issue?.labels ?? []}
            />
          </div>
          <div className="flex items-center gap-1 ml-auto mr-2 font-thin text-sm">
            <Calendar size={16} className="opacity-60" />
            <span>{formatTimeFromNow(issue?.updated_at!)}</span>
          </div>
        </div>
      </div>
      <div className="h-[calc(100vh-300px)] p-2">
        <div id="vditor" className="vditor "></div>
      </div>
      <div className="p-2">
        <div className="relative">
          <span className="absolute -top-4 left-4 bg-white p-1 py-0.5 text-primary font-thin">
            Cover Image
          </span>
          <input
            type="text"
            value={cover}
            onChange={(e) => {
              const value = e.target.value;
              setCover(value);
            }}
            className="w-full p-2 border border-gray-200 outline-none mb-6"
          />
        </div>
        <div className="relative">
          <span className="absolute -top-4 left-4 bg-white p-1 py-0.5 text-primary font-thin">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              setDescription(value);
            }}
            className="w-full p-2 border-gray-200 outline-none border"
            role="textbox"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
