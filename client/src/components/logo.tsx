import Image from "next/image";
import images from "@/assets/images";

export default function Logo() {
    return <Image  src={images.Logo} alt="brand"  height={32} width={142}/>
}