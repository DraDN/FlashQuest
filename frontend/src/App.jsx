import { useState, useEffect } from 'react';
import './App.css';

import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import Header from './components/Header'
import Homepage from './pages/Home';
import Dungeon from './pages/Dungeon';
import DeckEditor from './pages/DeckEditor';
import Results from './pages/Results';

function App() {
  const [page, setPage] = useState({
    name: sessionStorage.getItem('page_name') || 'home',
    related_object: sessionStorage.getItem('page_related_object') ? JSON.parse(sessionStorage.getItem('page_related_object')) : null,
  });

  useEffect(() => {
    sessionStorage.setItem('page_name', page.name);
    sessionStorage.setItem('page_related_object', page.related_object ? JSON.stringify(page.related_object) : null);
  }, [page]);

  return (
    <div className="font-pixel-normal">
      <Header />
    
      <SignedIn>
        <div className="flex">
          { page.name === 'home' && <Homepage onNavigate={setPage} /> }
          { page.name === 'dungeon' && <Dungeon dungeon={page.related_object} onNavigate={setPage} /> }
          { page.name === 'deck-editor' && <DeckEditor deck={page.related_object} onNavigate={setPage} /> }
          { page.name === 'results' && <Results results={page.related_object} onNavigate={setPage} /> }
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex flex-col *:text-center items-center justify-center bg-dungeon-dark-900 gap-8">
          <h1 className='md:text-8xl text-6xl font-pixel-title font-bold text-dungeon-yellow-glow text-shadow-dungeon-orange-glow text-shadow-md'>FlashQuest</h1>
          <h2 className='md:text-4xl text-3xl font-pixel-header text-dungeon-purple text-shadow-dungeon-purple text-shadow-md'>Create flashcards. Create unique dungeons. Battle with your knowledge.</h2>
          <div className='flex flex-col gap-4 font-pixel-header mt-8 *:text-2xl'>
            <SignUpButton className='text-dungeon-yellow text-shadow-dungeon-orange-glow text-shadow-md hover:text-dungeon-yellow-glow'>- Start your journey -</SignUpButton>
            <SignInButton className='text-dungeon-green-700 text-shadow-dungeon-green-900 text-shadow-md hover:text-dungeon-green'>- Continue your adventure -</SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  )
}

export default App
