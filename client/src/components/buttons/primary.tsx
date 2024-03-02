import classNames from "classnames";
import Button, { ButtonProps } from "./button";


export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={classNames("text-white bg-purple-600 hover:bg-purple-700", className)} {...props}>
      {children}
    </Button>
  );
}