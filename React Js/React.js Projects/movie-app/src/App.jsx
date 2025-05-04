import React, { useEffect, useState } from 'react'
import Search from './component/Search'
import Spinner from './component/Spinner';
import Card from './component/Card';
import { useDebounce } from 'react-use'; //npm i react-use => package for debouncing: Debouncing delays API calls until a user-defined pause in input.It improves performance and lowers server load by sending fewer requests.
import { updateSearchCount, setTrendingMovies as getTrendingMovies } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
//To get api key
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    // Authorization: `Bearer ${API_KEY}` 
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTE4NjU5NjMyN2ZjZjMyYzBkYThmZTYzMzE2NzE1NCIsIm5iZiI6MTc0NjExMzA0MS42ODYsInN1YiI6IjY4MTM5MjExNmMzNDI2YzQyZWIxZmQ0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X7qfl99rJB00rJrvqNOWYSrtN75p7_QRXGq44skxh-4'
  }
}

function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState('');

  // Debounce the search term to prevent making too many API requests by waiting for the user to stop typing for 500ms mili second
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      //if searched-movie/query exist than fetch search url if not then popular movie show
      const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      // const endPoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      const response = await fetch(endPoint, API_OPTIONS);
      
      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      console.log(data);
      
      if (data.response === 'false') {
        setErrorMessage(data.Error || 'Failed to fetch movies'); //If an API error is detected, set the error message
        setMovieList([]); //clear the movie list
        return; //Exit the function to prevent further processing
      }

      // If the API call was successful, update the movie list with the fetched data
      setMovieList(data.results || []);  

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch(error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');

    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async (query = '') => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);

    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }

  //if search movie then rerender web-page
  useEffect(() => {
    fetchMovies(debounceSearchTerm); //debounce because read above about debounce
  }, [debounceSearchTerm]) 

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  return (
    <main>
      <div className='pattern opacity-25 w-full'/>

      <div className="wrapper">
        <header>
          <img className='w-[100%]' src="hero.png" alt="" />
          <h1>Find<span className='text-gradient'> Movies </span>You'll Enjoy Hassle-Free</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2 className='mt-6 bg-[#040218]'>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                //because database id starts with $ sign
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>

          {isLoading ? (
            // <p className='text-white'>Loading...</p>
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                // <p key={movie.id} className='text-white'>{movie.title}</p>
                <Card key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>

    </main>
  )
}

export default App