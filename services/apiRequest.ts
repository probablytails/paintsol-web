import axios, { AxiosRequestConfig } from 'axios'

export const apiRequest = (config: AxiosRequestConfig<any>, isServerSideReq?: boolean) => {
  return axios.request({
    baseURL: isServerSideReq
      ?  `http://${process.env.NEXT_PUBLIC_INTERNAL_API_BASE_URL}:${process.env.NEXT_PUBLIC_INTERNAL_API_PORT}`
      : process.env.NEXT_PUBLIC_API_BASE_URL,
    ...config
  })
}
