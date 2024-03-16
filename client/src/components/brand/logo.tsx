import Image from "next/image";
import { brandConfig } from "@/config/brand";

export default function Logo() {
  return <Image src={brandConfig.logo} alt="brand" height={32} width={142} />;
}
