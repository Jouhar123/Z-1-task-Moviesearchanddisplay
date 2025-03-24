"use client";
import { useState } from "react";

const API_KEY = "48cd1c46";
const API_URL = "https://www.omdbapi.com/";

const MovieSearchApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);

  // Fetch movie suggestions using regex
  const fetchSuggestions = async (term) => {
    if (!term.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`${API_URL}?s=${term}&apikey=${API_KEY}`);
      const data = await response.json();
      if (data.Response === "True") {
        setSuggestions(data.Search.slice(0, 5)); // Show max 5 suggestions
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchMovies = async () => {
    if (!searchTerm.trim()) return;
    try {
      const response = await fetch(`${API_URL}?s=${searchTerm}&apikey=${API_KEY}`);
      const data = await response.json();
      console.log("API Response:", data);
      if (data.Response === "True") {
        setMovies(data.Search);
        setError(null);
      } else {
        setMovies([]);
        setError("No movies found. Try another search.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await fetch(`${API_URL}?i=${imdbID}&apikey=${API_KEY}`);
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  return (
    <div className="text-center p-5 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Movie Search App</h1>

      {/* Search Bar */}
      <div className="relative flex justify-center mb-5">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="p-2 text-white w-1/3 bg-gray-800 rounded-l-md border border-gray-600 focus:outline-none"
        />
        <button
          onClick={fetchMovies}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-700"
        >
          Search
        </button>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-10 w-1/3 bg-gray-800 border border-gray-600 text-white rounded-md shadow-lg">
            {suggestions.map((movie) => (
              <li
                key={movie.imdbID}
                className="p-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setSearchTerm(movie.Title);
                  setSuggestions([]);
                  fetchMovies();
                }}
              >
                {movie.Title} ({movie.Year})
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Movie Details View */}
      {selectedMovie ? (
        <div className="p-5 bg-gray-800 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-xl font-bold">{selectedMovie.Title} ({selectedMovie.Year})</h2>
          <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="w-full rounded-lg mt-3" />
          <p className="mt-2"><strong>Actors:</strong> {selectedMovie.Actors}</p>
          <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
          <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
          <p><strong>Box Office:</strong> {selectedMovie.BoxOffice}</p>
          <button
            onClick={() => setSelectedMovie(null)}
            className="mt-3 p-2 bg-red-500 text-white rounded-md hover:bg-red-700"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              onClick={() => fetchMovieDetails(movie.imdbID)}
              className="cursor-pointer bg-gray-800 p-3 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover rounded-lg" />
              <h3 className="text-lg font-semibold mt-2">{movie.Title} ({movie.Year})</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return <MovieSearchApp />;
}





