import { useState, useEffect } from 'react';
import './App.css';

import { SignedIn, SignedOut } from '@clerk/clerk-react';
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
    <>
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
        <div className="min-h-screen flex items-center justify-center">
          <h1 className='text-8xl'>FlashQuest</h1>
        </div>
      </SignedOut>
    </>
  )
}

export default App
