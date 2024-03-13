"use client";

import FileCard from "@/components/documents/file-card";
import FileIcon from "@/components/documents/file-icon";
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
import { toast } from "@/components/ui/use-toast";
import { MimeType, chatService } from "@/lib/services/chat-service";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { IconUploadCloud } from "@/components/ui/icons";

export default function Documents() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { accessTokenRaw } = useKindeBrowserClient();
  const [uploadingFile, setUploadingFile] = useState<{
    filename: string;
    size: string;
    type: MimeType;
    percentage: number;
  } | null>(null);

  const queryClient = useQueryClient();
  const chatsQuery = useQuery({
    queryKey: ["chats"],
    queryFn: chatService.getAllChats,
    enabled: !!accessTokenRaw,
  });

  const uploadFile = async (files: any[]) => {
    const file = files[0];

    // check if type is supported
    if (Object.values(MimeType).indexOf(file.type) === -1) {
      return toast({
        variant: "destructive",
        description: "File type not supported",
      });
    }

    // check if size is supported
    if (file.size > 1000000) {
      return toast({
        variant: "destructive",
        description: "File size too large",
      });
    }

    setUploadingFile({
      filename: file.name,
      size: Math.floor(file.size / 1000) + " KB",
      type: file.type,
      percentage: 0,
    });

    try {
      await chatService.createChat(file, (progress: number) => {
        setUploadingFile((prev: any) => ({ ...prev, percentage: progress }));
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setUploadingFile(null);
    }
  };

  return (
    <>
      {/* TODO: DO component for submenu + think of removing it here and use navbar directly */}
      <nav>
        {/* Submenu */}
        <div className="border-b h-10 border-b-gray-200 flex justify-center bg-white">
          <div className="px-2 md:px-8 w-full flex py-2 items-center">
            <button className="px-3 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-700 rounded">
              Documents
            </button>
            <button className="px-3 py-2 text-sm hover:bg-gray-50 font-semibold text-gray-700 rounded flex space-x-2 items-center">
              <span>Chat</span>
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      <main>
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
            <Dropzone onDrop={uploadFile}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="pointer-cursor border rounded-xl px-6 py-4 space-y-3 text-center">
                      <div className="border shadow-sm rounded-lg p-[10px] inline-block">
                        <IconUploadCloud className="h-6 w-6" />
                      </div>

                      <div>
                        <div className="space-x-1">
                          <Button variant="link-color">Click to upload</Button>
                          <span className="text-gray-600">
                            or drag and drop
                          </span>
                        </div>
                        <p className="text-gray-600">
                          PDF, TXT, or CSV (max. 1 MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>

            {uploadingFile && (
              <FileCard
                name={uploadingFile.filename}
                size={uploadingFile.size}
                mimetype={uploadingFile.type}
                percentage={uploadingFile.percentage}
                uploading={true}
              />
            )}

            {chatsQuery.data && chatsQuery.data?.length !== 0 && (
              <div>
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="max-w-sm px-3 py-2"
                />

                {/* List of files and chats */}
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-white">
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
                    {chatsQuery.data
                      ?.filter((c) => {
                        if (search === "") return true;
                        return c.filename
                          .toLowerCase()
                          .includes(search.toLowerCase());
                      })
                      .map((chat) => (
                        <TableRow key={chat.id}>
                          <TableCell
                            className="pl-1 flex items-center space-x-3 cursor-pointer"
                            onClick={() => {
                              router.push(`/app/chat/${chat.id}`);
                            }}
                          >
                            <FileIcon
                              mimetype={chat.mimetype}
                              className="h-10 w-10"
                            />
                            <div className="">
                              <p className="font-medium text-sm text-gray-900">
                                {chat.filename}
                              </p>
                              <p className="text-sm text-gray-600">
                                {Math.floor(chat.filesize / 1000)} MB
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {chat.created_at.toDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <button>
                              <EllipsisVerticalIcon className="h-5 w-5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
