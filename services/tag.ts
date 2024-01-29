import { apiRequest } from './apiRequest'

export const getAllTags = async () => {
  const response = await apiRequest({
    method: 'GET',
    url: '/tags/all'
  })

  return response?.data
}

export const getAllTagsWithImages = async () => {
  const response = await apiRequest({
    method: 'GET',
    url: '/tags/all-with-images'
  })

  return response?.data
}
