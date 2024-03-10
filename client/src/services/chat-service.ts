import apiClient from "@/config/api-client"
import { AxiosProgressEvent } from "axios";

export enum MimeType {
    pdf = 'application/pdf',
    text = 'text/plain',
    json = 'application/json',
    csv = 'text/csv',
}

interface ChatMetadataDto {
    id: string;
    filename: string;
    mimetype: MimeType;
    created_at: Date;
    owner: string;
  }


export class ChatService {

    constructor() {}

    async getAllChats(): Promise<ChatMetadataDto[]> {
        const res = await apiClient.get("/api/chats")
        return res.data.map((c: any) => ({...c, created_at: new Date(c.created_at)}))
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


}

export const chatService = new ChatService()