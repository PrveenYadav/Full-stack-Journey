import React from 'react'
import { useParams, useLocation } from 'react-router-dom';

function CardInfo() {

    const {movieId} = useParams();
    const location = useLocation();
    const movie = location.state

    if (!movie) {
        return <div className='text-white'>No movie data found for ID: {movieId}</div>;
    }
        
    const { title, poster_path, vote_average, release_date, original_language, overview, backdrop_path } = movie;

    const backdropUrl = backdrop_path
    ? `https://image.tmdb.org/t/p/original/${backdrop_path}` // Use 'original' for potentially higher resolution
    : '';

  return (
    <div 
        style={{
            backgroundImage: backdropUrl ? `url('${backdropUrl}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'right',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // gap: '10px',
            color: 'white',
        }}
        className='min-h-screen flex flex-col md:flex-row items-center justify-center text-white'
    >

        <img className='w-[100vw] h-screen min-w-xs max-w-full' src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={title} />

        <div className='h-screen bg-black opacity-75 inline-block items-center justify-center p-10'>
            <h1 className='text-gradient font-bold mb-10 text-3xl md:text-5xl'>{title}</h1>
            <p className="mb-2 text-xl flex gap-1"><span className='font-bold text-2xl'>Rating: </span> <img src="../star.svg" alt="Star Icon" /> {vote_average.toFixed(1)}</p>
            <p className="mb-2 text-xl"><span className='font-bold text-2xl'>Language: </span>{original_language}</p>
            <p className="mb-2 text-xl"><span className='font-bold text-2xl'>Release Year: </span>{release_date.split('-')[0]}</p>
            <p className="mb-2 text-xl"><span className='font-bold text-2xl'>About the Movie: </span>{overview}</p>
        </div>
    </div>
  )
}

export default CardInfo