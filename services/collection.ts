import { Collection, CollectionQuerySort, CollectionQueryType } from '@/lib/types'
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
  sort: CollectionQuerySort
  type: CollectionQueryType
}

export const getCollections = async ({ page = 1, sort, type }: GetCollections) => {
  const response = await apiRequest({
    method: 'GET',
    url: '/collections',
    params: {
      page,
      sort,
      type
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

type RemoveImageFromCollection = {
  collection_id: number
  image_id: number
}

export const removeImageFromCollection = async ({
  collection_id,
  image_id
}: RemoveImageFromCollection) => {
  const data = {
    collection_id,
    image_id
  }
  const response = await apiRequest({
    method: 'POST',
    url: '/collection/image/remove',
    withCredentials: true,
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response?.data
}

type NewImagePosition = {
  image_id: number
  image_position: number
}

type UpdateCollectionImagePositions = {
  collection_id: number
  newImagePositions: NewImagePosition[]
}

export const updateCollectionImagePositions = async ({
  collection_id,
  newImagePositions
}: UpdateCollectionImagePositions) => {
  const response = await apiRequest({
    method: 'POST',
    url: '/collection/image/image-positions/update',
    withCredentials: true,
    data: {
      collection_id,
      newImagePositions
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response?.data
}

type NewPreviewImagePosition = {
  image_id: number
  preview_position: number
}

type UpdateCollectionPreviewImagePositions = {
  collection_id: number
  newPreviewPositions: NewPreviewImagePosition[]
}

export const updateCollectionPreviewImagePositions = async ({
  collection_id,
  newPreviewPositions
}: UpdateCollectionPreviewImagePositions) => {
  const response = await apiRequest({
    method: 'POST',
    url: '/collection/image/preview-positions/update',
    withCredentials: true,
    data: {
      collection_id,
      newPreviewPositions
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response?.data
}
