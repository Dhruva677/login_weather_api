import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import "./Row.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function Row({ title, fetchUrl, isLargeRow = false, onMovieClick }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const rowRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const request = await axios.get(fetchUrl);
                setMovies(request.data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [fetchUrl]);

    const handleScroll = (direction) => {
        if (rowRef.current) {
            const scrollAmount = direction === "left" ? -600 : 600;
            rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="row">
                <h2 className="row__title">{title}</h2>
                <div className="row__posters row__posters--loading">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`row__poster-skeleton ${isLargeRow ? "row__poster-skeleton--large" : ""}`} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            <h2 className="row__title">{title}</h2>
            <div className="row__container">
                <button
                    className="row__arrow row__arrow--left"
                    onClick={() => handleScroll("left")}
                    aria-label="Scroll left"
                >
                    ‹
                </button>
                <div className="row__posters" ref={rowRef}>
                    {movies.map((movie) =>
                        movie.poster_path ? (
                            <div
                                key={movie.id}
                                className={`row__poster-wrapper ${isLargeRow ? "row__poster-wrapper--large" : ""}`}
                                onClick={() => onMovieClick(movie)}
                            >
                                <img
                                    className={`row__poster ${isLargeRow ? "row__poster--large" : ""}`}
                                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                    alt={movie.title || movie.name}
                                    loading="lazy"
                                />
                                <div className="row__poster-overlay">
                                    <div className="row__poster-info">
                                        <p className="row__poster-title">{movie.title || movie.name}</p>
                                        <div className="row__poster-meta">
                                            <span className="row__poster-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                                            <span className="row__poster-year">
                                                {(movie.release_date || movie.first_air_date || "").slice(0, 4)}
                                            </span>
                                        </div>
                                        <button className="row__poster-play">▶ Play</button>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
                <button
                    className="row__arrow row__arrow--right"
                    onClick={() => handleScroll("right")}
                    aria-label="Scroll right"
                >
                    ›
                </button>
            </div>
        </div>
    );
}

export default Row;
