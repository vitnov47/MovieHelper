import { useGetTopMoviesQuery } from "../api/movieApi";
import useMovieContext from "../context/movie-context";
import type { Movie, ServerResponse } from "../types/movie";
import FilmSection from "./FilmSection";
import LoadingSection from "./LoadingSection";

interface MoviesSectionProps {
  searchData: ServerResponse | undefined;
  isSearchLoading: boolean;
  isSearchError: boolean;
}

const MoviesSection = ({
  searchData,
  isSearchLoading,
  isSearchError,
}: MoviesSectionProps) => {
  const { searchTerm, isDarkMode } = useMovieContext();
  let movies: Movie[] = [];
  let isLoading = false;
  let isError = false;

  const {
    data: topMoviesData,
    isLoading: isTopMoviesLoading,
    isError: isTopMoviesError,
  } = useGetTopMoviesQuery(undefined, {
    skip: !!searchTerm,
  });

  if (searchTerm) {
    isLoading = isSearchLoading;
    isError = isSearchError;
    const allItems = searchData?.films || [];
    movies = allItems.filter(
      (f) => !f.type || f.type === "FILM" || f.type === "VIDEO",
    );
  } else {
    isLoading = isTopMoviesLoading;
    isError = isTopMoviesError;
    movies = topMoviesData?.films || [];
  }

  return (
    <>
      {isError && "Ошибка загрузки фильмов"}

      {isDarkMode ? (
        <hr color="#7a7a7a" style={{ marginBottom: 20 }} />
      ) : (
        <hr color="#d7d7d7" style={{ marginBottom: 20 }} />
      )}

      <FilmSection title="Фильмы" films={movies} isLoading={isLoading} />

      {isLoading && <LoadingSection />}

      {!isLoading && movies.length === 0 && (
        <h3 style={{ color: "white", textAlign: "center" }}>
          Фильмы не найдены
        </h3>
      )}
    </>
  );
};

export default MoviesSection;
