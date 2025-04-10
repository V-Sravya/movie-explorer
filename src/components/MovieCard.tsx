import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';
import { useMovieContext } from '../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
  onAddToWatchlist?: (movie: Movie) => void;
  onRemoveFromWatchlist?: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) => {
  return (
    <Link to={`/movie/${movie.imdbID}`} className="card movie-card">
      <div className="movie-card-poster">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
          alt={movie.Title}
        />
      </div>
      
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.Title}</h3>
        <p className="movie-card-year">{movie.Year}</p>
        <div className="movie-card-actions">
          {onAddToWatchlist && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToWatchlist(movie);
              }}
              className="btn btn-primary text-sm"
            >
              Add to Watchlist
            </button>
          )}
          {onRemoveFromWatchlist && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveFromWatchlist(movie.imdbID);
              }}
              className="btn btn-secondary text-sm"
            >
              Remove from Watchlist
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}; 