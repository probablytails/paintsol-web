import { Collection } from '@/lib/types'
import { apiRequest } from './apiRequest'

export const getAllCollections = async () => {
  const response = await apiRequest({
    method: 'GET',
    url: '/collections/all'
  })

  return response?.data
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

export const createCollection = async (formData: any) => {
  const response = await apiRequest({
    method: 'POST',
    url: '/collection',
    withCredentials: true,
    data: formData,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response?.data
}

export const updateCollection = async (id: number, formData: any) => {
  formData.id = id

  const response = await apiRequest({
    method: 'POST',
    url: '/collection/update',
    withCredentials: true,
    data: formData,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response?.data
}

export const deleteCollection = async (id: number) => {
  const response = await apiRequest({
    method: 'POST',
    url: `/collection/delete/${id}`,
    headers: {
      'Content-Type': 'application/json'
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

type AddImageToCollection = {
  collection_id: number
  image_id: number
  isPreview: boolean
}

export const addImageToCollection = async ({
  collection_id,
  image_id,
  isPreview
}: AddImageToCollection) => {
  const data = {
    collection_id,
    image_id,
    isPreview
  }
  const response = await apiRequest({
    method: 'POST',
    url: '/collection/image/add',
    withCredentials: true,
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response?.data
}
