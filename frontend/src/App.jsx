import { useState } from 'react';
import './App.css';

import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './components/Header'
import Homepage from './pages/Home';
import Dungeon from './pages/Dungeon';

function App() {
  const [page, setPage] = useState('home');

  return (
    <>
      <Header />
    
      <SignedIn>
        <div className="min-h-screen flex">
          { page === 'home' && <Homepage onNavigate={setPage} /> }
          { page === 'dungeon' && <Dungeon onNavigate={setPage} /> }
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className='text-8xl'>FlashQuest</h1>
        </div>
      </SignedOut>
    </>
  )
}

export default App
