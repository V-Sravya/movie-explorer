import React from 'react';
import { MovieCard } from '../components/MovieCard';
import { useMovieContext } from '../context/MovieContext';

export const Watchlist: React.FC = () => {
  const { watchlist, removeFromWatchlist } = useMovieContext();

  if (watchlist.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-4xl font-bold text-center mb-8">My Watchlist</h1>
        <div className="text-center">
          <p>Your watchlist is empty.</p>
          <p className="mt-2">Add some movies to your watchlist from the home page!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-center mb-8">My Watchlist</h1>
      <div className="grid">
        {watchlist.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onRemoveFromWatchlist={removeFromWatchlist}
            showRating={false}
          />
        ))}
      </div>
    </div>
  );
}; 