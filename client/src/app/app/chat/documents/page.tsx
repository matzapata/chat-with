import { PdfIcon } from "@/components/icons/pdf-icon";
import { UploadCloudIcon } from "@/components/icons/upload-cloud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export default function Documents() {
  return (
    <div className="pt-12 pb-24 max-w-6xl mx-auto space-y-6">
      {/* Heading */}
      <div className="px-4 md:px-8 space-y-8 ">
        <h1 className="font-semibold text-2xl md:3xl text-gray-900">
          Documents
        </h1>

        <div className=" space-y-1 pb-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            One document one chat
          </h2>
          <p className="text-gray-600">Upload documents to create chats</p>
        </div>
      </div>

      <div className="px-4 md:px-8 space-y-8">
        {/* Upload file */}
        <div className=" border rounded-xl px-6 py-4 space-y-3 text-center">
          <div className="border shadow-sm rounded-lg p-[10px] inline-block">
            <UploadCloudIcon className="h-6 w-6" />
          </div>

          <div>
            <div className="space-x-1">
              <Button variant="link-color">Click to upload</Button>
              <span className="text-gray-600">or drag and drop</span>
            </div>
            <p className="text-gray-600">PDF, TXT, or CSV (max. 1 MB)</p>
          </div>
        </div>

        <div>
          <Input placeholder="Search..." className="max-w-sm px-3 py-2" />

          {/* List of files and chats */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-1 text-sm font-medium text-gray-600 flex-1">
                  Filename
                </TableHead>
                <TableHead className="text-sm font-medium text-gray-600 text-center">
                  Created at
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="pl-1 flex items-center space-x-3">
                  <PdfIcon className="h-10 w-10" />
                  <div className="">
                    <p className="font-medium text-sm text-gray-900">
                      Filename.pdf
                    </p>
                    <p className="text-sm text-gray-600">200 MB</p>
                  </div>
                </TableCell>
                <TableCell className="text-center">2021-08-12</TableCell>
                <TableCell className="text-right">
                  <button>
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
