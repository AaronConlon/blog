"use client";

import clsx from "clsx";
import { annotate } from "rough-notation";
import type {
  RoughAnnotation,
  RoughAnnotationConfig,
} from "rough-notation/lib/model";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type RoughNotationOptions = Omit<
  Pick<
    RoughAnnotationConfig,
    | "type"
    | "color"
    | "strokeWidth"
    | "padding"
    | "iterations"
    | "animationDuration"
    | "multiline"
  >,
  "type"
> & {
  type?: RoughAnnotationConfig["type"];
};

export function useRoughNotation(
  options: RoughNotationOptions,
  active = true
) {
  return useTypedRoughNotation<HTMLElement>(options, active);
}

export function useTypedRoughNotation<TElement extends HTMLElement>(
  {
    type = "underline",
    color,
    strokeWidth = 1.5,
    padding,
    iterations,
    animationDuration,
    multiline,
  }: RoughNotationOptions,
  active = true
) {
  const ref = useRef<TElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !active) return;

    let annotation: RoughAnnotation | undefined;
    const frameId = window.requestAnimationFrame(() => {
      annotation = annotate(element, {
        animate: true,
        type,
        color,
        strokeWidth,
        padding,
        iterations,
        animationDuration,
        multiline,
      });
      annotation.show();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      annotation?.remove();
    };
  }, [
    active,
    animationDuration,
    color,
    iterations,
    multiline,
    padding,
    strokeWidth,
    type,
  ]);

  return ref;
}

type RoughNotationTextProps = Omit<
  ComponentPropsWithoutRef<"span">,
  "color"
> &
  RoughNotationOptions & {
    children: ReactNode;
    active?: boolean;
  };

export default function RoughNotationText({
  children,
  className,
  type = "underline",
  color = "#007a7a",
  strokeWidth = 1.5,
  active = true,
  padding,
  iterations,
  animationDuration,
  multiline,
  ...props
}: RoughNotationTextProps) {
  const ref = useTypedRoughNotation<HTMLSpanElement>(
    {
      type,
      color,
      strokeWidth,
      padding,
      iterations,
      animationDuration,
      multiline,
    },
    active
  );

  return (
    <span
      {...props}
      ref={ref}
      className={clsx("section-heading", className)}
      data-type={type}
      data-color={color}
    >
      {children}
    </span>
  );
}
