import { Artist } from '@/lib/types'
import { apiRequest } from './apiRequest'

export const getAllArtists = async () => {
  const response = await apiRequest({
    method: 'GET',
    url: '/artists/all'
  })

  return response?.data as Artist[]
}

export const getAllArtistsWithImages = async () => {
  const response = await apiRequest({
    method: 'GET',
    url: '/artists/all-with-images'
  })

  return response?.data as Artist[]
}

export const getArtistById = async (id: number) => {
  const response = await apiRequest({
    method: 'GET',
    url: `/artist/${id}`
  })

  return response?.data as Artist
}