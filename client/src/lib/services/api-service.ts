import axios, { AxiosInstance } from "axios"

export class ApiService {
    private readonly _client: AxiosInstance;

    constructor() {
        this._client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        });
    }

    public get client() {
        return this._client;
    }
}

export const apiService = new ApiService()