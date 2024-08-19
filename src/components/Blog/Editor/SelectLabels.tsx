import { LabelOption, TLabel } from "@/features/types";
import chroma from "chroma-js";

import Select, { StylesConfig } from "react-select";

const customStyles: StylesConfig<LabelOption, true> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
};

export default function SelectLabels({
  labels,
  onChange,
  defaultLabels,
}: {
  labels: TLabel[];
  onChange: (newValue: any[]) => void;
  defaultLabels?: TLabel[];
}) {
  const options = labels.map((label) => ({
    value: label.name,
    label: label.name,
    color: label.color,
  }));

  const defaultValue = defaultLabels?.map((label) => ({
    value: label.name,
    label: label.name,
    color: label.color,
  }));

  return (
    <Select
      closeMenuOnSelect={false}
      isMulti
      options={options}
      styles={customStyles}
      onChange={(newValue) => {
        console.log("new value", newValue);
        onChange(newValue.map((i) => i.value));
      }}
      defaultValue={defaultValue}
    />
  );
}
