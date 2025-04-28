import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { searchMovies, getTrendingMovies, getTopRatedMovies } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { useMovieContext } from '../context/MovieContext';

type MovieSection = 'trending' | 'top-rated' | 'search';

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<MovieSection>('trending');
  const { addToWatchlist, removeFromWatchlist, watchlist } = useMovieContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Reset state when navigating to home
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveSection('trending');
      setSearchQuery('');
      setCurrentPage(1);
      fetchMovies('trending');
    }
  }, [location.pathname]);

  const fetchMovies = async (section: MovieSection, query: string = '', page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      switch (section) {
        case 'trending':
          response = await getTrendingMovies(page);
          break;
        case 'top-rated':
          response = await getTopRatedMovies(page);
          break;
        case 'search':
          response = await searchMovies(query, page);
          break;
      }
      
      if (response.Response === 'False') {
        setError(response.Error || 'No movies found');
        setMovies([]);
        setTotalPages(0);
        return;
      }
      
      setMovies(response.Search || []);
      
      const total = parseInt(response.totalResults);
      const pages = Math.max(1, Math.ceil(total / 10));
      setTotalPages(pages);
    } catch (err) {
      setError('Failed to fetch movies. Please try again later.');
      console.error(err);
      setMovies([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setActiveSection('search');
    fetchMovies('search', query, 1);
  };

  const handleSectionChange = (section: MovieSection) => {
    setActiveSection(section);
    setCurrentPage(1);
    setSearchQuery('');
    fetchMovies(section);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMovies(activeSection, searchQuery, page);
  };

  // Check if a movie is in the watchlist
  const isInWatchlist = (movieId: string) => {
    return watchlist.some(m => m.imdbID === movieId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Movie Explorer</h1>
      
      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => handleSectionChange('trending')}
          className={`px-4 py-2 rounded-lg ${
            activeSection === 'trending'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => handleSectionChange('top-rated')}
          className={`px-4 py-2 rounded-lg ${
            activeSection === 'top-rated'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Top Rated
        </button>
      </div>
      
      {/* Search section */}
      <div className="search-section mb-8">
        <SearchBar 
          onSearch={handleSearch} 
          initialQuery={searchQuery}
        />
        
        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
      </div>

      {/* Movie grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {movies.length === 0 && !error && !loading ? (
          <div className="text-center col-span-full">
            <p>No movies found. Try another search term.</p>
          </div>
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onAddToWatchlist={!isInWatchlist(movie.imdbID) ? addToWatchlist : undefined}
              onRemoveFromWatchlist={isInWatchlist(movie.imdbID) ? removeFromWatchlist : undefined}
            />
          ))
        )}
      </div>

      {movies.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}; 