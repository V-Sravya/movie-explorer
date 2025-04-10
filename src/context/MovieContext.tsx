import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie } from '../types/movie';

interface MovieContextType {
  watchlist: Movie[];
  userRatings: Record<string, number>;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: string) => void;
  rateMovie: (movieId: string, rating: number) => void;
  getRating: (movieId: string) => number | null;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('userRatings');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
  }, [userRatings]);

  const addToWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId: string) => {
    setWatchlist((prev) => prev.filter((movie) => movie.imdbID !== movieId));
  };

  const rateMovie = (movieId: string, rating: number) => {
    setUserRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
  };

  const getRating = (movieId: string) => {
    return userRatings[movieId] || null;
  };

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        userRatings,
        addToWatchlist,
        removeFromWatchlist,
        rateMovie,
        getRating,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}; 