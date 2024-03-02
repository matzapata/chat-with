import classNames from "classnames";
import Button, { ButtonProps } from "./button";

export function TertiaryGrayButton({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={classNames("text-gray-700 hover:bg-gray-50", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
