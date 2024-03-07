"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { EnterIcon } from "@/components/icons/enter-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar } from "@/components/avatar";
import { GptIcon } from "@/components/icons/gpt-icon";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

import AppLayout from "@/layouts/app-layout";

export default function Chat() {
  function onSubmit(e: any) {
    e.preventDefault();
    // console.log(data);
  }

  return (
    <AppLayout
      className="sticky top-0 z-10 bg-white overflow-y-hidden"
      nestedItems={[
        {
          link: "/app/chat",
          title: "Filename.txt",
        },
        {
          link: "/app/chat/documents",
          title: "Documents",
        },
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* messages */}
        <div className="flex flex-1 flex-col relative ">
          <div className="divide-y overflow-y-scroll no-scrollbar pb-[150px] divide-gray-100 max-w-3xl mx-auto h-screen px-4">
            <HumanMessage />
            <AiMessage />
            <HumanMessage />
            <AiMessage />
            <HumanMessage />
            <AiMessage />
          </div>

          {/* input */}
          <div className="fixed bottom-0 left-0 w-screen ">
            <div className="border-t md:border bg-white z-50 border-gray-300 shadow-lg px-4 py-2 max-w-4xl mx-auto md:rounded-t-lg">
              <form onSubmit={onSubmit} className="flex items-center relative">
                <div
                  contentEditable="true"
                  className="w-full border border-gray-300 rounded-md resize-none bg-transparent px-16 py-[1.3rem] focus-within:outline-none focus:outline-none sm:text-sm"
                  style={{ height: "max-content" }}
                  spellCheck="false"
                ></div>

                <button
                  type="submit"
                  className="absolute right-4 top-4 p-0 h-8 w-8 flex items-center justify-center bg-brand-600 text-white rounded-md"
                >
                  <EnterIcon className="h-4 w-4" />
                </button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full border-gray-300 border p-2 absolute left-4 top-4">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New chat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </form>
              <p className=" mt-2 text-center text-gray-600 text-xs">
                The llm will only answer based on your file content
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function HumanMessage() {
  return (
    <div className="py-6 flex space-x-6">
      <div>
        <Avatar height={30} width={30} />
      </div>
      <div className="pt-1 flex-1">
        <p className="">
          Control the opacity of the divide color using the color opacity
          modifier. Control the opacity of the divide color using the color
          opacity modifier. Control the opacity of the divide color using the
          color opacity modifier.
        </p>
      </div>
      <div className="pt-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="">
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function AiMessage() {
  return (
    <div className="py-6 flex space-x-6">
      <div>
        <div className="bg-gray-900 h-[30px] w-[30px] flex items-center justify-center rounded-full">
          <GptIcon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="pt-1 flex-1">
        <p className="">
          Control the opacity of the divide color using the color opacity
          modifier. Control the opacity of the divide color using the color
          opacity modifier. Control the opacity of the divide color using the
          color opacity modifier.
        </p>
      </div>
      <div className="pt-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="">
                <DocumentDuplicateIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
