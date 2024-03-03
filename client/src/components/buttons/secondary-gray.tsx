import classNames from "classnames";
import Button, { ButtonProps } from "./button";

export function SecondaryGrayButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={classNames(
        "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
