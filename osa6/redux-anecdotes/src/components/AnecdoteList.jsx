import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    const anecdotes = useSelector(({ filter, anecdotes }) => {

        if (filter === 'ALL') {
            return anecdotes
        }

        return anecdotes.filter((anecdote) =>
            anecdote.content.includes(filter)
        )
    })


    return (
        <div>
            {anecdotes
                .slice()
                .sort((a, b) => b.votes - a.votes)
                .map(anecdote => (
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => {
                                dispatch(voteAnecdote(anecdote))
                                dispatch(showNotification(`You voted for "${anecdote.content}"`, 5000))
                            }}>vote</button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
export default AnecdoteList