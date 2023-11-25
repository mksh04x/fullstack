import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
    axios.get(baseUrl).then(res => res.data)


export const createAnecdote = newAnecdote =>
    axios.post(baseUrl, newAnecdote).then(res => res.data)

   export const voteFor = async (content) => {
        const object = { content: content.content, id: content.id, votes: content.votes + 1 }
        const response = await axios.put(`${baseUrl}/${content.id}`, object)
        return response.data
      }
