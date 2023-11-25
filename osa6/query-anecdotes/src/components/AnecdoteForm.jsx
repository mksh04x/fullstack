import { useQuery, useMutation, useQueryClient } from 'react-query'
import { createAnecdote, voteFor } from '../requests'
import notificationContext from '../notificationContext'
import { useContext } from 'react'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const [notification, notificationDispatch] = useContext(notificationContext, '')

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({ content })
    if (content.length >= 5) {
      notificationDispatch({ type: 'notification', payload: 'anecdote created' })
      setTimeout(() => {
        notificationDispatch({ type: 'null', payload: '' })
      }, 5000)
    } else {
      notificationDispatch({
        type: 'notification', payload: 'anecdote too short'
      })
    }
  }
  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit" >create</button>
      </form>
    </div>
  )
}


export default AnecdoteForm
