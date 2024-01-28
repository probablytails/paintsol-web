import { apiRequest } from './apiRequest'

export const getImagesCountMaterializedView = async () => {
  const isServerSideRequest = true
  const response = await apiRequest({
    method: 'GET',
    url: '/images/count'
  }, isServerSideRequest)

  return response?.data as { image_count: number }
}
