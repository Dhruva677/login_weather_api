import { useState, useEffect } from "react";
import axios from "../api/axios";
import requests from "../api/requests";
import "./Banner.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";

function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

function Banner({ onMovieClick }) {
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(requests.fetchNetflixOriginals);
                const movies = request.data.results;
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                setMovie(randomMovie);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    return (
        <header
            className="banner"
            style={{
                backgroundImage: movie
                    ? `url(${IMAGE_BASE_URL}${movie?.backdrop_path})`
                    : "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
            }}
        >
            <div className="banner__overlay" />
            <div className="banner__contents">
                <div className="banner__badge">🔥 Featured Today</div>
                <h1 className="banner__title">
                    {movie?.title || movie?.name || movie?.original_name}
                </h1>
                <p className="banner__description">
                    {truncate(movie?.overview, 200)}
                </p>
                <div className="banner__buttons">
                    <button
                        className="banner__button banner__button--play"
                        onClick={() => movie && onMovieClick(movie)}
                    >
                        ▶ Play
                    </button>
                    <button
                        className="banner__button banner__button--info"
                        onClick={() => movie && onMovieClick(movie)}
                    >
                        ℹ More Info
                    </button>
                </div>
                <div className="banner__meta">
                    {movie?.vote_average && (
                        <span className="banner__rating">
                            ⭐ {movie.vote_average.toFixed(1)} / 10
                        </span>
                    )}
                    {movie?.first_air_date && (
                        <span className="banner__year">
                            {new Date(movie.first_air_date).getFullYear()}
                        </span>
                    )}
                </div>
            </div>
            <div className="banner__fadeBottom" />
        </header>
    );
}

export default Banner;
