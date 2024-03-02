import Image from "next/image";
import LogoImage from "../assets/logo.png"

export default function Logo() {
    return <Image  src={LogoImage} alt="brand"  height={32} width={142}/>
}