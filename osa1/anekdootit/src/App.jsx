import { useState } from 'react'
import _ from 'lodash';

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length));
  const mostVotedIndex = points.indexOf(Math.max(...points));

  const voteplus = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  const randomNumero = () => {
    const randomIndex = _.random(0, anecdotes.length - 1)
    setSelected(randomIndex)
  };
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]} has {points[selected]} votes
      <div>
        <Button handleClick={voteplus} text='vote' />
        <Button handleClick={randomNumero} text='next anecdote' />
      </div>
      <h1>Anecdote with most votes</h1>
      {anecdotes[mostVotedIndex]} has {points[mostVotedIndex]} votes
    </div>
  )
}
export default App