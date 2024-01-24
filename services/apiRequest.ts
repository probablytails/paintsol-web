import axios, { AxiosRequestConfig } from 'axios'

export const apiRequest = (config: AxiosRequestConfig<any>) => {
  return axios.request({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    ...config
  })
}
