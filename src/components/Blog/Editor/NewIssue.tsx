import { localIssuesAtom } from "@/features/atom";
import { TLabel } from "@/features/types";
import { useSetAtom } from "jotai";
import { FilePlus2, X } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import SelectLabels from "./SelectLabels";

interface NewIssueProps {
  labels: TLabel[];
}

export default function NewIssue({ labels }: NewIssueProps) {
  const [show, setShow] = useState(false);
  const setLocalIssue = useSetAtom(localIssuesAtom);
  const form = useRef({
    title: "",
    description: "",
    cover: "",
  });

  const [localLabels, setLocalLabels] = useState([] as string[]);

  const onConfirm = () => {
    const title =
      document.querySelector<HTMLInputElement>("#title")?.value ?? "没标题";
    const description =
      document.querySelector<HTMLInputElement>("#description")?.value ?? "";
    const cover =
      document.querySelector<HTMLInputElement>("#cover")?.value ??
      "/coder3.svg";
    form.current = {
      title,
      description,
      cover,
    };
    // create local issue
    const timestampString = new Date().toISOString();
    const now = Date.now();
    setLocalIssue((prev) => [
      ...prev,
      {
        ...form.current,
        labels: localLabels.map(
          (i) => labels.find((label) => label.name === i)!
        ),
        body: "",
        number: now,
        updated_at: timestampString,
        id: now.toString(),
      },
    ]);
    toast.success("创建成功");
    setShow(false);
  };

  return (
    <>
      <button
        className="flex items-center justify-center gap-1"
        onClick={() => setShow(true)}
      >
        <FilePlus2 className="w-8" />
      </button>
      {show &&
        createPortal(
          <div className="fixed w-screen h-screen flex justify-center items-center bg-gray-500/20 z-50">
            <div className="max-w md:min-w-[520px] max-w-[90%] md:min-h-[max(90vh_720px)] flex flex-col gap-4 p-4 bg-white rounded-md shadow-md">
              <div className="flex justify-between items-center">
                <span>创建新文章</span>
                <button onClick={() => setShow(false)}>
                  <X size={16} />
                </button>
              </div>
              {/* content  */}
              <div className="flex-grow flex flex-col gap-2 font-[14px]">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="border border-gray-10 focus-within:border-gray-200 transition-all px-2 py-1 rounded-md outline-none w-full leading-6"
                  placeholder="title"
                />
                <SelectLabels
                  labels={labels}
                  onChange={(value) => {
                    setLocalLabels(value);
                  }}
                />
                <input
                  type="text"
                  name="cover"
                  id="cover"
                  className="border border-gray-10 focus-within:border-gray-200 transition-all px-2 py-1 rounded-md outline-none w-full leading-6"
                  placeholder="https://..."
                />
                <div className="flex justify-start">
                  {/* preview cover */}
                  <textarea
                    name="description"
                    id="description"
                    className="p-2 rounded-md border border-gray-100 focus:border-gray-200 transition-all flex-grow block outline-none"
                    rows={4}
                    placeholder="description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-1">
                <button
                  className="px-2 py-0.5 rounded-md"
                  onClick={() => setShow(false)}
                >
                  取消
                </button>
                <button
                  className="px-2 py-0.5 border bg-primary text-white rounded-md"
                  onClick={onConfirm}
                >
                  确认
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
