import {apiService} from "@/lib/services/api-service"
import { AxiosInstance, AxiosProgressEvent } from "axios";

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

export enum MessageRole {
    user = 'USER',
    ai = 'AI',
}

export interface ChatMessage {
    content: string;
    role: MessageRole;
}


export interface ChatDto extends ChatMetadataDto {
    messages: ChatMessage[];
}


export class ChatService {

    constructor(private readonly client: AxiosInstance) { }

    async getAllChats(): Promise<ChatMetadataDto[]> {
        const res = await this.client.get("/api/chats")
        return res.data.map((c: any) => ({ ...c, created_at: new Date(c.created_at) }))
    }

    async createChat(file: File, onUploadProgress?: (progress: number) => void): Promise<ChatMetadataDto> {
        const formData = new FormData()
        formData.append("file", file)

        const res = await this.client.post("/api/chats", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent?.total ?? 1))
                onUploadProgress?.(percentCompleted)
            },
        })
        return res.data
    }

    async getChat(id: string): Promise<ChatDto> {
        const res = await this.client.get(`/api/chats/${id}`)
        return { ...res.data, created_at: new Date(res.data.created_at) }
    }

    async postMessage(id: string, message: string): Promise<ChatMessage> {
        const res = await this.client.put(`/api/chats/${id}`, { message })
        return {
            content: res.data.aiMessage.message,
            role: MessageRole.ai,
        }
    }


}

export const chatService = new ChatService(apiService.client)