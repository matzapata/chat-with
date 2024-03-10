import { MimeType } from "@/services/chat-service";
import { PdfIcon } from "../icons/pdf-icon";
import { TxtIcon } from "../icons/txt-icon";
import { CsvIcon } from "../icons/csv-icon";
import { FileIcon as GenericFileIcon } from "../icons/file-icon";


interface FileIconProps extends React.SVGProps<SVGSVGElement> {
    mimetype: MimeType | string
}

export default function FileIcon({ mimetype, ...props }: FileIconProps) {
    if (mimetype === MimeType.pdf) {
        return <PdfIcon {...props }/>
    } else if (mimetype === MimeType.text) {
        return <TxtIcon {...props }/>
    } else if (mimetype === MimeType.json) {
        return <TxtIcon {...props }/>
    } else if (mimetype === MimeType.csv) {
        return <CsvIcon {...props }/>
    } else return <GenericFileIcon {...props }/> 
}