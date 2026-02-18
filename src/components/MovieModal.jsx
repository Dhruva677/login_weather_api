import "./MovieModal.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";

function MovieModal({ movie, onClose }) {
    if (!movie) return null;

    return (
        <div className="modal__backdrop" onClick={onClose}>
            <div className="modal__container" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose}>✕</button>
                <div
                    className="modal__hero"
                    style={{
                        backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path})`,
                    }}
                >
                    <div className="modal__hero-overlay" />
                    <div className="modal__hero-content">
                        <h2 className="modal__title">{movie.title || movie.name || movie.original_name}</h2>
                        <div className="modal__actions">
                            <button className="modal__btn modal__btn--play">▶ Play</button>
                            <button className="modal__btn modal__btn--list">+ My List</button>
                        </div>
                    </div>
                </div>
                <div className="modal__body">
                    <div className="modal__meta">
                        <span className="modal__rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                        <span className="modal__year">
                            {(movie.release_date || movie.first_air_date || "").slice(0, 4)}
                        </span>
                        {movie.adult === false && <span className="modal__badge">PG-13</span>}
                    </div>
                    <p className="modal__overview">{movie.overview}</p>
                    {movie.genre_ids && (
                        <p className="modal__genres">
                            <strong>Genres:</strong> {movie.genre_ids.join(", ")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MovieModal;
