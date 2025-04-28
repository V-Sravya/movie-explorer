import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Movie } from '../types/movie';
import { searchMovies, getTrendingMovies, getTopRatedMovies } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { useMovieContext } from '../context/MovieContext';

type MovieSection = 'trending' | 'top-rated' | 'search';
const MOVIES_PER_PAGE = 12;

interface LocationState {
  searchQuery?: string;
  movies?: Movie[];
  currentPage?: number;
  totalPages?: number;
  activeSection?: MovieSection;
}

export const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [movies, setMovies] = useState<Movie[]>(state?.movies || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(state?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(state?.totalPages || 1);
  const [searchQuery, setSearchQuery] = useState(state?.searchQuery || '');
  const [activeSection, setActiveSection] = useState<MovieSection>(state?.activeSection || 'trending');
  const { addToWatchlist, removeFromWatchlist, watchlist } = useMovieContext();

  // Reset state when navigating to home without state
  useEffect(() => {
    if (location.pathname === '/' && !location.state) {
      setActiveSection('trending');
      setSearchQuery('');
      setCurrentPage(1);
      fetchMovies('trending');
    }
  }, [location.pathname, location.state]);

  const updateLocationState = (newState: Partial<LocationState>) => {
    navigate('/', {
      replace: true,
      state: {
        searchQuery,
        movies,
        currentPage,
        totalPages,
        activeSection,
        ...newState
      }
    });
  };

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
        updateLocationState({ 
          movies: [], 
          totalPages: 0,
          searchQuery: query,
          currentPage: page,
          activeSection: section
        });
        return;
      }
      
      const newMovies = response.Search || [];
      const total = parseInt(response.totalResults);
      const pages = Math.max(1, Math.ceil(total / MOVIES_PER_PAGE));
      
      setMovies(newMovies);
      setTotalPages(pages);
      updateLocationState({ 
        movies: newMovies, 
        totalPages: pages,
        searchQuery: query,
        currentPage: page,
        activeSection: section
      });
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
      
      {/* Section Tabs */}
      <div className="section-tabs">
        <button
          onClick={() => handleSectionChange('trending')}
          className={`section-tab ${activeSection === 'trending' ? 'active' : ''}`}
        >
          Trending
        </button>
        <button
          onClick={() => handleSectionChange('top-rated')}
          className={`section-tab ${activeSection === 'top-rated' ? 'active' : ''}`}
        >
          Top Rated
        </button>
      </div>
      
      {/* Search section */}
      <div className="search-section">
        <SearchBar 
          onSearch={handleSearch} 
          initialQuery={searchQuery}
        />
        
        {error && (
          <div className="text-red-500 text-center mt-4">{error}</div>
        )}
      </div>

      {/* Movie grid */}
      <div className="grid">
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