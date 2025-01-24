import { useState } from 'react'
import Header from './Components/Header'
import Home from './pages/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <Home/>
    </>
  )
}

export default App
