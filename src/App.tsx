import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { Watchlist } from './pages/Watchlist';
import { MovieProvider } from './context/MovieContext';
import { HomeIcon, FilmIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" onClick={handleHomeClick} className="flex items-center space-x-2">
          <HomeIcon className="h-6 w-6" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <div className="flex space-x-4">
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`flex items-center space-x-2 ${
              location.pathname === '/' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            <FilmIcon className="h-6 w-6" />
            <span className="hidden sm:inline">Movies</span>
          </Link>
          <Link
            to="/watchlist"
            className={`flex items-center space-x-2 ${
              location.pathname === '/watchlist' ? 'text-blue-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            <BookmarkIcon className="h-6 w-6" />
            <span className="hidden sm:inline">Watchlist</span>
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
