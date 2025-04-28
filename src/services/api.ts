import axios from 'axios';
import { Movie, MovieDetail, MovieSearchResponse } from '../types/movie';

const API_KEY = '1de845aa';
const BASE_URL = 'http://www.omdbapi.com';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apikey: API_KEY,
  },
});

export const searchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
  try {
    const response = await api.get('/', {
      params: {
        s: query,
        page,
      },
    });
    
    // Return the data, even if it contains an error response
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    // Return an object that matches the MovieSearchResponse interface
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
    const response = await api.get('/', {
      params: {
        s: 'movie',
        page,
        type: 'movie',
        y: new Date().getFullYear(),
      },
    });
    
    return response.data;
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
    const response = await api.get('/', {
      params: {
        s: 'movie',
        page,
        type: 'movie',
        sort: 'rating',
      },
    });
    
    return response.data;
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