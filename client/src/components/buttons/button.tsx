import classNames from "classnames";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function Button({
  children,
  loading,
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const sizeClassnames = {
    sm: "py-[10px] px-[18px]",
    md: "py-[10px] px-[18px]",
    lg: "py-[10px] px-[18px]",
    xl: "py-[12px] px-[18px]",
    "2xl": "py-[16px] px-[24px] text-lg",
  }[size];

  return (
    <button
      className={classNames(
        "block text-center rounded-lg font-semibold",
        sizeClassnames,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
