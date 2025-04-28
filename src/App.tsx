import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { Watchlist } from './pages/Watchlist';
import { MovieProvider } from './context/MovieContext';
import { HomeIcon, FilmIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <HomeIcon />
            <span>Home</span>
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/watchlist"
            className={`nav-link ${location.pathname === '/watchlist' ? 'active' : ''}`}
          >
            <BookmarkIcon />
            <span>Watchlist</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MovieProvider>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </main>
        </div>
      </MovieProvider>
    </Router>
  );
};

export default App;
