import React from "react"
import { ChatMessage } from "@/lib/services/chat-service"


export default function useChat(chatId: string, initialMessages: ChatMessage[] = []) {
    const [messages, setMessages] = React.useState(initialMessages)
    const [isLoading, setIsLoading] = React.useState(true)
    const [input, setInput] = React.useState("")
    const append = (message: ChatMessage) => setMessages((prev) => [...prev, message])
    
    return { messages, setMessages, isLoading, input, setInput, append}
}