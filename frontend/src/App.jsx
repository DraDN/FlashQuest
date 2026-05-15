import { useState } from 'react'
import { useEffect } from 'react'
// import './App.css'

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'


const API = import.meta.env.VITE_API_URL;

function App() {
  const [status, setStatus] = useState('ok')
  const [decks, setDecks] = useState([])
  const { user } = useUser();

  useEffect(() => {
    fetch(`${API}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setStatus(data.status);
      })
  }, []);

  useEffect(() => {
    fetch(`${API}/api/decks?user_id=${user.id}`)
      .then((res) => res.json())
      .then(setDecks);
  }, [user.id]);

  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <h1>{status}</h1>
      <h2> Test decks: </h2>
      {decks.map((deck) => (
        <p key={deck.id}>{deck.name}</p>
      ))}
    </>
  )
}

export default App
