import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Board from './components/Board'
import './App.css'
import FormInfo from './components/FormInfo'
import { useDroppable } from '@dnd-kit/core'
import GrabImage from './components/GrabImage'
import { CardProvider } from './components/CardContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CardProvider>

      <Board />
      <div>
        {/* <FormInfo /> */}
      </div>
      <div>
        <GrabImage />
       </div>
      </CardProvider>
    </>
  )
}

export default App


// small change