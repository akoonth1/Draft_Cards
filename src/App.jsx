import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Board from './components/Board'
import './App.css'
import FormInfo from './components/FormInfo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Board />
      <div>
        <FormInfo />
      </div>
      <div>
       </div>
    </>
  )
}

export default App
