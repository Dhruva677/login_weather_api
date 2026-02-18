import { useState } from "react";
import Nav from "../components/Nav";
import Banner from "../components/Banner";
import Row from "../components/Row";
import MovieModal from "../components/MovieModal";
import requests from "../api/requests";

function Home() {
    const [selectedMovie, setSelectedMovie] = useState(null);

    return (
        <div className="app">
            <Nav />
            <Banner onMovieClick={setSelectedMovie} />
            <div className="app__rows">
                <Row
                    title="🔥 Netflix Originals"
                    fetchUrl={requests.fetchNetflixOriginals}
                    isLargeRow
                    onMovieClick={setSelectedMovie}
                />
                <Row
                    title="📈 Trending Now"
                    fetchUrl={requests.fetchTrending}
                    onMovieClick={setSelectedMovie}
                />
                <Row
                    title="⭐ Top Rated"
                    fetchUrl={requests.fetchTopRated}
                    onMovieClick={setSelectedMovie}
                />
                <Row
                    title="💥 Action"
                    fetchUrl={requests.fetchActionMovies}
                    onMovieClick={setSelectedMovie}
                />
                <Row
                    title="😂 Comedy"
                    fetchUrl={requests.fetchComedyMovies}
                    onMovieClick={setSelectedMovie}
                />
                <Row
                    title="😱 Horror"
                    fetchUrl={requests.fetchHorrorMovies}
                    onMovieClick={setSelectedMovie}
                />
                <Row
                    title="💕 Romance"
                    fetchUrl={requests.fetchRomanceMovies}
                    onMovieClick={setSelectedMovie}
                />
                <Row
                    title="🎥 Documentaries"
                    fetchUrl={requests.fetchDocumentaries}
                    onMovieClick={setSelectedMovie}
                />
            </div>
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </div>
    );
}

export default Home;
