import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { searchMovies } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { useMovieContext } from '../context/MovieContext';

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('movie');
  const { addToWatchlist, removeFromWatchlist, watchlist } = useMovieContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Load search state from localStorage on component mount
  useEffect(() => {
    const savedSearchQuery = localStorage.getItem('searchQuery');
    const savedPage = localStorage.getItem('currentPage');
    
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    }
    
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
    
    // Fetch movies with saved state
    fetchMovies(savedSearchQuery || 'movie', savedPage ? parseInt(savedPage) : 1);
  }, []);

  const fetchMovies = async (query: string = 'movie', page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchMovies(query, page);
      
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
      
      // Save search state to localStorage
      localStorage.setItem('searchQuery', query);
      localStorage.setItem('currentPage', page.toString());
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
    fetchMovies(query, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMovies(searchQuery, page);
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
      
      {/* Search section with improved accessibility */}
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
      <div className="grid mt-8">
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