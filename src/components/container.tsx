import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "header" | "footer" | "article";
};

export function Container({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag
      {...rest}
      className={`mx-auto w-full max-w-6xl px-6 md:px-8 ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
