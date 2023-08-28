import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedObject, objectId) => {
  const response = await axios.put(`${baseUrl}/${objectId}`, updatedObject)
  return response.data
}

const remove = async (objectId) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${objectId}`, config)
  return response.data
}

const blogService = { setToken, getAll, create, update, remove }
export default blogService
