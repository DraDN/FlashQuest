import { useState } from 'react'
// import './App.css'

import { useEffect } from 'react'

function App() {
  // const [count, setCount] = useState(0)
  const [status, setStatus] = useState('ok')

  useEffect(() => {
    fetch('http://api.docker:3000/api/health')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setStatus(data.status);
      })
  }, [])

  return (
    <>
      <h1>{status}</h1>
    </>
  )
}

export default App
