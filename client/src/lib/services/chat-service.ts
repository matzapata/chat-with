import apiClient from "@/config/api-client"
import { AxiosProgressEvent } from "axios";

export enum MimeType {
    pdf = 'application/pdf',
    text = 'text/plain',
    json = 'application/json',
    csv = 'text/csv',
}

export interface ChatMetadataDto {
    id: string;
    filename: string;
    mimetype: MimeType;
    filesize: number;
    created_at: Date;
    owner: string;
}

export enum MessageAgent {
    user = 'USER',
    ai = 'AI',
}

export interface ChatMessage {
    id: number;
    message: string;
    created_at: Date;
    agent: MessageAgent;
}


export interface ChatDto extends ChatMetadataDto {
    messages: ChatMessage[];
}


export class ChatService {

    constructor() { }

    async getAllChats(): Promise<ChatMetadataDto[]> {
        const res = await apiClient.get("/api/chats")
        return res.data.map((c: any) => ({ ...c, created_at: new Date(c.created_at) }))
    }

    async createChat(file: File, onUploadProgress?: (progress: number) => void): Promise<ChatMetadataDto> {
        const formData = new FormData()
        formData.append("file", file)

        const res = await apiClient.post("/api/chats", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ?? 1))
                onUploadProgress?.(percentCompleted)
            },
        })
        return res.data
    }

    async getChat(id: string): Promise<ChatDto> {
        const res = await apiClient.get(`/api/chats/${id}`)
        return { ...res.data, created_at: new Date(res.data.created_at) }
    }

    async postMessage(id: string, message: string): Promise<ChatMessage> {
        const res = await apiClient.put(`/api/chats/${id}`, { message })
        return {
            id: res.data.aiMessage.id,
            message: res.data.aiMessage.message,
            agent: MessageAgent.ai,
            created_at: new Date(res.data.aiMessage.created_at)
        }
    }


}

export const chatService = new ChatService()