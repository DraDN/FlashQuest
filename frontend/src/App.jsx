import { useState, useEffect } from 'react';
import './App.css';

import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './components/Header'
import Homepage from './pages/Home';
import Dungeon from './pages/Dungeon';
import DeckEditor from './pages/DeckEditor';

function App() {
  const [page, setPage] = useState(sessionStorage.getItem('page') || 'home');
  const [page_related_object, setPageRelatedObject] = useState(() => {
    if (sessionStorage.getItem('page_related_object')) {
      return JSON.parse(sessionStorage.getItem('page_related_object'));
    }
    return null;
  });

  useEffect(() => {
    sessionStorage.setItem('page', page);
    sessionStorage.setItem('page_related_object', JSON.stringify(page_related_object));
  }, [page, page_related_object]);

  return (
    <>
      <Header />
    
      <SignedIn>
        <div className="flex">
          { page === 'home' && <Homepage onNavigate={(page, page_related_object) => {
            setPage(page);
            setPageRelatedObject(page_related_object);
          }} /> }
          { page === 'dungeon' && <Dungeon dungeon={page_related_object} onNavigate={setPage} /> }
          { page === 'deck-editor' && <DeckEditor deck={page_related_object} onNavigate={setPage} /> }
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
