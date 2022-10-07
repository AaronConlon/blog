import { IRepoLabel } from "@/interfaces";
import { calcReverseColor } from "@/utils/color";

interface IProps {
  label: IRepoLabel;
}
function Label({ label: { name, color } }: IProps) {
  return (
    <div
      style={{
        backgroundColor: `#${color}`,
        color: calcReverseColor(color),
      }}
      className="p-1 px-2 rounded-sm"
    >
      {name}
    </div>
  );
}

export default Label;
