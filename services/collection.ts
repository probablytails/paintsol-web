import { Collection } from '@/lib/types'
import { apiRequest } from './apiRequest'

export const getAllCollections = async () => {
  const response = await apiRequest({
    method: 'GET',
    url: '/collections/all'
  })

  return response?.data as Collection[]
}

type GetCollections = {
  page: number
}

export const getCollections = async ({ page = 1 }: GetCollections) => {
  const response = await apiRequest({
    method: 'GET',
    url: '/collections',
    params: {
      page
    }
  })

  return response?.data
}

export const getCollection = async (idOrSlug: number | string, isServerSideReq?: boolean) => {
  const response = await apiRequest({
    method: 'GET',
    url: `/collection/${idOrSlug}`
  }, isServerSideReq)

  return response?.data as Collection
}

export const createCollection = async (id: number, formData: FormData) => {
  formData.append('id', id.toString())

  const response = await apiRequest({
    method: 'POST',
    url: '/collection',
    withCredentials: true,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response?.data
}

export const getPreferredCollectionPageUrl = (collection: Collection) => {
  if (collection?.slug) {
    return `/collection/${collection.slug}`
  } else {
    return `/collection/${collection.id}`
  }
}
