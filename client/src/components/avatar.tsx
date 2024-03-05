import Image from "next/image";
import AvatarImage from "../assets/images/avatar.png";

// TODO: This is static
export function Avatar() {
  return <Image src={AvatarImage} alt="Avatar" height={40} width={40} />;
}
