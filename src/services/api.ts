import axios from 'axios';
import { Movie, MovieDetail, MovieSearchResponse } from '../types/movie';

const API_KEY = '1de845aa';
const BASE_URL = 'http://www.omdbapi.com';
const MOVIES_PER_PAGE = 12;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

export const searchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
  try {
    // Since OMDB API only supports 10 results per page, we need to make two calls to get 12 movies
    const firstCall = api.get('/', {
      params: {
        s: query,
        page: Math.ceil((page * MOVIES_PER_PAGE - 11) / 10),
      },
    });

    const secondCall = api.get('/', {
      params: {
        s: query,
        page: Math.ceil((page * MOVIES_PER_PAGE) / 10),
      },
    });

    const [firstResponse, secondResponse] = await Promise.all([firstCall, secondCall]);
    
    if (firstResponse.data.Response === 'False') {
      return firstResponse.data;
    }

    // Combine results from both calls and slice to get exactly MOVIES_PER_PAGE movies
    const allMovies = [...(firstResponse.data.Search || []), ...(secondResponse.data.Search || [])];
    const startIndex = ((page - 1) * MOVIES_PER_PAGE) % 10;
    const movies = allMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

    return {
      Search: movies,
      totalResults: firstResponse.data.totalResults,
      Response: 'True'
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: 'Failed to connect to the movie database'
    };
  }
};

export const getTrendingMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  try {
    // Similar approach for trending movies
    const firstCall = api.get('/', {
      params: {
        s: 'movie',
        page: Math.ceil((page * MOVIES_PER_PAGE - 11) / 10),
        type: 'movie',
        y: new Date().getFullYear(),
      },
    });

    const secondCall = api.get('/', {
      params: {
        s: 'movie',
        page: Math.ceil((page * MOVIES_PER_PAGE) / 10),
        type: 'movie',
        y: new Date().getFullYear(),
      },
    });

    const [firstResponse, secondResponse] = await Promise.all([firstCall, secondCall]);
    
    if (firstResponse.data.Response === 'False') {
      return firstResponse.data;
    }

    const allMovies = [...(firstResponse.data.Search || []), ...(secondResponse.data.Search || [])];
    const startIndex = ((page - 1) * MOVIES_PER_PAGE) % 10;
    const movies = allMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

    return {
      Search: movies,
      totalResults: firstResponse.data.totalResults,
      Response: 'True'
    };
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: 'Failed to fetch trending movies'
    };
  }
};

export const getTopRatedMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  try {
    // Similar approach for top rated movies
    const firstCall = api.get('/', {
      params: {
        s: 'movie',
        page: Math.ceil((page * MOVIES_PER_PAGE - 11) / 10),
        type: 'movie',
        sort: 'rating',
      },
    });

    const secondCall = api.get('/', {
      params: {
        s: 'movie',
        page: Math.ceil((page * MOVIES_PER_PAGE) / 10),
        type: 'movie',
        sort: 'rating',
      },
    });

    const [firstResponse, secondResponse] = await Promise.all([firstCall, secondCall]);
    
    if (firstResponse.data.Response === 'False') {
      return firstResponse.data;
    }

    const allMovies = [...(firstResponse.data.Search || []), ...(secondResponse.data.Search || [])];
    const startIndex = ((page - 1) * MOVIES_PER_PAGE) % 10;
    const movies = allMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

    return {
      Search: movies,
      totalResults: firstResponse.data.totalResults,
      Response: 'True'
    };
  } catch (error) {
    console.error('Failed to fetch top rated movies:', error);
    return {
      Search: [],
      totalResults: '0',
      Response: 'False',
      Error: 'Failed to fetch top rated movies'
    };
  }
};

export const getMovieById = async (id: string): Promise<MovieDetail> => {
  try {
    const response = await api.get('/', {
      params: {
        i: id,
        plot: 'full',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to get movie details:', error);
    throw new Error('Failed to fetch movie details');
  }
};

export const getMovieByTitle = async (title: string): Promise<MovieDetail> => {
  try {
    const response = await api.get('/', {
      params: {
        t: title,
        plot: 'full',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to get movie by title:', error);
    throw new Error('Failed to fetch movie details');
  }
}; 