import { apiRequest } from './apiRequest'

export const getArtistsCountMaterializedView = async () => {
  const isServerSideRequest = true
  const response = await apiRequest({
    method: 'GET',
    url: '/artists/count'
  }, isServerSideRequest)

  return response?.data
}
