import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)


const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return (<h1>no feedback given yet</h1>)
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average / all} />
          <StatisticLine text="positive" value={`${(positive / all) * 100}%`} />
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const goodUp = () => {
    setGood(good + 1)
    setAll(all + 1)
    setAverage(average + 1)
    setPositive(positive + 1)
  }
  const neutralUp = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }
  const badUp = () => {
    setBad(bad + 1)
    setAll(all + 1)
    setAverage(average - 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={goodUp} text='good' />
      <Button handleClick={neutralUp} text='neutral' />
      <Button handleClick={badUp} text='bad' />

      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App
