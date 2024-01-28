import { apiRequest } from './apiRequest'

export const getTagsCountMaterializedView = async () => {
  const isServerSideRequest = true
  const response = await apiRequest({
    method: 'GET',
    url: '/tags/count'
  }, isServerSideRequest)

  return response?.data
}
