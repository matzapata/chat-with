import classNames from "classnames";
import Button, { ButtonProps } from "./button";


export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={classNames("text-white bg-brand-600 hover:bg-brand-700", className)} {...props}>
      {children}
    </Button>
  );
}