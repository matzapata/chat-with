'use client'


import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { EmptyScreen } from '@/components/chat/empty-screen'
import { ChatScrollAnchor } from '@/components/chat/chat-scroll-anchor'
import React from 'react'
import { Message } from './message'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)

  // All this comes from useChat hook that we will create in the next step. takes initialMessages

  const [messages, setMessages] = React.useState(initialMessages || [])
  const append = (message: Message) => setMessages((prev) => [...prev, message])
  const reload = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

    
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  )
}
