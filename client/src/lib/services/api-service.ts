import axios from "axios"

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
})

const setAccessToken = (accessToken: string) => {
    console.log("access token", accessToken)
    client.defaults.headers.common.Authorization = `Bearer ${accessToken}`
}

export const apiService = {
    client,
    setAccessToken
}

