import classNames from "classnames";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  children,
  loading,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "block text-center py-[10px] px-[18px] rounded-lg font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
