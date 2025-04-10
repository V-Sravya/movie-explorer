import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MovieDetail } from '../types/movie';
import { getMovieById } from '../services/api';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useMovieContext } from '../context/MovieContext';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getRating, rateMovie, addToWatchlist, removeFromWatchlist, watchlist } = useMovieContext();

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        setError('Failed to fetch movie details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-8">
        <div className="text-red-500 text-center">{error || 'Movie not found'}</div>
      </div>
    );
  }

  const userRating = getRating(movie.imdbID);
  const isInWatchlist = watchlist.some((m) => m.imdbID === movie.imdbID);

  return (
    <div className="container py-8">
      <div className="movie-details">
        <div>
          <div className="movie-poster-container">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
              alt={movie.Title}
              className="movie-poster"
            />
          </div>
          
          <div className="rating-overlay">
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => rateMovie(movie.imdbID, rating)}
                  className="focus:outline-none"
                >
                  {rating <= (userRating || 0) ? (
                    <StarIcon className="star-filled" />
                  ) : (
                    <StarOutlineIcon className="star-empty" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="movie-info">
          <h1 className="text-4xl font-bold">{movie.Title}</h1>
          <div className="movie-meta">
            <span>{movie.Year}</span>
            <span>•</span>
            <span>{movie.Runtime}</span>
            <span>•</span>
            <span>{movie.Rated}</span>
          </div>

          <div className="movie-rating">
            <div className="flex items-center">
              <StarIcon className="star-filled" />
              <span className="ml-1">{movie.imdbRating}/10</span>
            </div>
            <span>•</span>
            <span>{movie.imdbVotes} votes</span>
          </div>

          <div className="movie-plot">
            <h2 className="text-xl font-semibold">Plot</h2>
            <p>{movie.Plot}</p>
          </div>

          <div className="movie-details-grid">
            <h2 className="text-xl font-semibold">Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <p className="detail-label">Genre</p>
                <p className="detail-value">{movie.Genre}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Director</p>
                <p className="detail-value">{movie.Director}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Writer</p>
                <p className="detail-value">{movie.Writer}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Cast</p>
                <p className="detail-value">{movie.Actors}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Language</p>
                <p className="detail-value">{movie.Language}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Country</p>
                <p className="detail-value">{movie.Country}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Awards</p>
                <p className="detail-value">{movie.Awards}</p>
              </div>
              {movie.BoxOffice && (
                <div className="detail-item">
                  <p className="detail-label">Box Office</p>
                  <p className="detail-value">{movie.BoxOffice}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => isInWatchlist ? removeFromWatchlist(movie.imdbID) : addToWatchlist(movie)}
              className={`btn ${isInWatchlist ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 