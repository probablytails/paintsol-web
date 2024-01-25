import { Image } from '@/lib/types'
import { apiRequest } from './apiRequest'

export type ImageVersion = 'animation' | 'border' | 'no-border'

export const getPreferredImagePageUrl = (image: Image) => {
  if (image?.slug) {
    return `/${image.slug}`
  } else {
    return `/${image.id}`
  }
}

export const getAvailableImageUrl = (preferredVersion: ImageVersion | null, image: Image) => {
  const availableImageVersion = getAvailableImageVersion(preferredVersion, image)
  return getImageUrl(image.id, availableImageVersion)
}

const getImageUrl = (id: number, imageVersion: ImageVersion | null) => {
  if (imageVersion === 'animation') {
    return `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${id}-animation.gif`
  } else if (imageVersion === 'border') {
    return `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${id}-border.png`
  } else {
    return `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${id}-no-border.png`
  }
}

const getAvailableImageVersion = (origVersion: ImageVersion | null, image: Image) => {
  if (origVersion === 'animation' && image.has_animation) {
    return 'animation'
  } else if (origVersion === 'border' && image.has_border) {
    return 'border'
  } else if (origVersion === 'no-border' && image.has_no_border) {
    return 'no-border'
  } else {
    return image.has_no_border
      ? 'no-border'
      : image.has_border
        ? 'border'
        : image.has_animation
          ? 'animation'
          : 'no-border'
  }
}

export const convertImagesToImageCardItems = (preferredVersion: ImageVersion, images: Image[]) => {
  return images?.map((image) => {
    const imageVersion = getAvailableImageVersion(preferredVersion, image)
    const imageUrl = getImageUrl(image.id, imageVersion)
    return {
      imageSrc: imageUrl,
      tags: image.tags,
      title: image.title
    }
  })
}

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

  return response?.data
}

export const getImage = async (idOrSlug: number | string ) => {
  const response = await apiRequest({
    method: 'GET',
    url: `/image/${idOrSlug}`
  })

  return response?.data
}

type GetImages = {
  page: number
}

export const getImages = async ({ page = 1 }: GetImages) => {
  const response = await apiRequest({
    method: 'GET',
    url: '/images',
    params: {
      page
    }
  })

  return response?.data
}

type GetImagesByTagId = {
  page: number
  tagId: number
}

export const getImagesByTagId = async ({ page = 1, tagId }: GetImagesByTagId) => {
  const response = await apiRequest({
    method: 'GET',
    url: '/images/by-tag',
    params: {
      page,
      id: tagId
    }
  })

  return response?.data
}
