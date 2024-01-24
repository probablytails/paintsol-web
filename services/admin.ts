import { apiRequest } from './apiRequest'

export const getUserInfo = async () => {
  try {
    const response = await apiRequest({
      method: 'get',
      url: '/admin/userinfo',
      withCredentials: true
    })
    
    return response?.data || null
  } catch (error) {
    return null
  }
}
