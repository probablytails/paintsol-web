import { apiRequest } from './apiRequest'

export const createImage = async (formData: FormData) => {
  const response = await apiRequest({
    method: 'POST',
    url: '/image',
    withCredentials: true,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response
}
