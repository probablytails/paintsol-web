import { Tag } from '@/lib/types'
import { apiRequest } from './apiRequest'
import { ImageType } from './image'

export const getAllTags = async () => {
  const response = await apiRequest({
    method: 'GET',
    url: '/tags/all'
  })

  return response?.data as Tag[]
}

export const getAllTagsWithImages = async (imageType: ImageType) => {
  const response = await apiRequest({
    method: 'GET',
    url: '/tags/all-with-images',
    params: {
      imageType
    }
  })

  return response?.data as Tag[]
}

export const getTagById = async (id: number) => {
  const response = await apiRequest({
    method: 'GET',
    url: `/tag/${id}`
  })

  return response?.data as Tag
}