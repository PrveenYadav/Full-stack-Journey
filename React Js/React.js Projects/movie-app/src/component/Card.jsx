import React from 'react'
import { useNavigate } from 'react-router-dom'

function Card({ movie: 
    { title, vote_average, poster_path, release_date, original_language, id, overview, backdrop_path }
}) {

    const navigate = useNavigate();
    
    const handleClick = () => {
        console.log(`Clicked on movie: ${title} (ID: ${id}), navigating to details...`);
        navigate(`/card-info/${id}`, {
            state: { 
                title,
                poster_path,
                vote_average,
                release_date,
                original_language,
                id,
                overview,
                backdrop_path
            },
        });
    };

  return (
    <div onClick={handleClick} className='movie-card cursor-pointer'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} alt={title} />

        <div className="mt-4">
            <h3>{title}</h3>

            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>

                    <span>•</span>
                    <p className="lang">{original_language}</p>

                    <span>•</span>
                    <p className="year">
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Card