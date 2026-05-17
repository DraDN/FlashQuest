import { useState } from 'react';
import './App.css';

import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Header from './components/Header'
import Homepage from './pages/Home';
import Dungeon from './pages/Dungeon';
import DeckEditor from './pages/DeckEditor';

function App() {
  const [page, setPage] = useState('home');
  const [page_related_object, setPageRelatedObject] = useState(null);

  return (
    <>
      <Header />
    
      <SignedIn>
        <div className="min-h-screen flex">
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
