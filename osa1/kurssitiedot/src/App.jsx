import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age
  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>
        So you were probably born {bornYear()}
      </p>
    </div>
  )
}

const Display = ({ counter }) => <div>{counter}</div>


const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(" ")}
    </div>
  )
}

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"))
    setLeft(left + 1)
  }
  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }


  const [counter, setCounter] = useState(0)

  console.log('rendering with counter value', counter)
  const increaseByOne = () => {
    console.log('increasing, value before', counter)
    setCounter(counter + 1)
  }
  const decreaseByOne = () => {
    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }
  const setToZero = () => {
    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }


  const nimi = 'mika'
  const ika = 28
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={nimi} age={ika} />
      <Display counter={counter} />

      <div>
        <div>
          {left}
          <Button handleClick={handleLeftClick} text='left' />
          <Button handleClick={handleRightClick} text='right' />
          {right}
          <History allClicks={allClicks} />
        </div>
      </div>


      <Button handleClick={increaseByOne}
        text="plus"
      />
      <Button handleClick={setToZero}
        text="zero"
      />
      <Button handleClick={decreaseByOne}
        text="minus"
      />
    </div>
  )
}
export default App
