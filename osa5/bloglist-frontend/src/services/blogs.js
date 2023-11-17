import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating blog:', error)
      throw error
    })
}

const del = async (id) => {
  try {
    const config = {
      headers: { Authorization: token }
    }
    await axios.delete(`${baseUrl}/${id}`, config)
  } catch (error) {
    console.error('error deleting blog', error)
  }
}




export default { getAll, create, setToken, update, del }