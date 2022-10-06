import { labelsAtom, tabAtom } from "@/store";
import { useAtom, useSetAtom } from "jotai";

import { calcReverseColor } from "@/utils/color";

function LabelList() {
  const [labelStore, setLabelStore] = useAtom(labelsAtom);
  const setTab = useSetAtom(tabAtom);

  const onSetCurrentLabel = (name: string) => {
    setTab(name);
    setLabelStore((prev) => ({ ...prev, isShow: false }));
  };

  const onClickBox = (e: MouseEvent) => {
    e.stopPropagation();
    setLabelStore({ isShow: false, list: labelStore.list });
  };

  if (labelStore.isShow === false || labelStore.list?.length === 0)
    return null;
  return (
    <div
      className="fixed left-0 right-0 bottom-0 right-0 bg-[#808080c9] z-50 w-screen h-screen flex justify-center items-start p-32"
      onClick={onClickBox}
    >
      <ul className="bg-white flex gap-4 p-12 rounded-md max-w-[60vw] flex-wrap justify-center">
        {labelStore.list.map(({ id, name, color }) => (
          <li
            key={id}
            className="p-1 px-2 rounded-sm cursor-pointer"
            style={{
              backgroundColor: `#${color}`,
              color: calcReverseColor(color),
            }}
            onClick={() => onSetCurrentLabel(name)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LabelList;
