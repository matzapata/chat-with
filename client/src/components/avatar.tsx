import Image from "next/image";
import AvatarImage from "../assets/images/avatar.png";

// TODO: This is static
export function Avatar({ height, width }: { height?: number; width?: number }) {
  return <Image src={AvatarImage} alt="Avatar" height={height ?? 40} width={width ?? 40} />;
}
