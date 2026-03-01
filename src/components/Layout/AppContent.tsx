import {
  useSearchMoviesQuery,
  useGetTopMoviesQuery,
  useGetTopSeriesQuery,
} from "../../api/movieApi";
import { Layout } from "antd";
import "../../styles/card.css";
import FilmSection from "../FilmSection";
import type { Movie } from "../../types/movie";
import LoadingSection from "../LoadingSection";
import useMovieContext from "../../context/movie-context";
import ModalFilm from "../ModalFilm";

const AppContent = () => {
  const { searchTerm, isDarkMode } = useMovieContext();

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchMoviesQuery(searchTerm, {
    skip: !searchTerm,
  });

  const {
    data: topMoviesData,
    isLoading: isTopMoviesLoading,
    isError: isTopMoviesError,
  } = useGetTopMoviesQuery(undefined, {
    skip: !!searchTerm,
  });

  const {
    data: topSeriesData,
    isLoading: isTopSeriesLoading,
    isError: isTopSeriesError,
  } = useGetTopSeriesQuery(undefined, { skip: !!searchTerm });

  const darkGradient = "linear-gradient(135deg, #14092a, #341477, #03226a)";
  const neonGradient = "linear-gradient(135deg, #5d0c96, #212ca5, #1c8fa6)";

  let movies: Movie[] = [];
  let series: Movie[] = [];
  let isLoading = false;
  let isError = false;

  if (searchTerm) {
    isLoading = isSearchLoading;
    isError = isSearchError;
    const allItems = searchData?.films || [];
    movies = allItems.filter(
      (f) => !f.type || f.type === "FILM" || f.type === "VIDEO",
    );

    series = allItems.filter(
      (f) =>
        f.type === "TV_SERIES" ||
        f.type === "TV_SHOW" ||
        f.type === "MINI_SERIES",
    );
  } else {
    isLoading = isTopMoviesLoading || isTopSeriesLoading;
    isError = isTopMoviesError || isTopSeriesError;

    movies = topMoviesData?.films || [];
    series = topSeriesData?.films || [];
  }

  return (
    <Layout.Content
      style={{
        padding: "20px",
        paddingTop: "64px",
        backgroundImage: isDarkMode ? darkGradient : neonGradient,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2
          style={{
            color: "white",
            textShadow: "0 0 10px rgba(255,255,255,0.3)",
          }}
        >
          {searchTerm ? "Результаты поиска" : "Популярное сейчас"}
        </h2>

        {isError && <h1>Ошибка загрузки</h1>}



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

        {isDarkMode ? (
          <hr color="#7a7a7a" style={{ marginBottom: 20 }} />
        ) : (
          <hr color="#d7d7d7" style={{ marginBottom: 20 }} />
        )}
        <FilmSection title="Сериалы" films={series} isLoading={isLoading} />
        {isLoading && <LoadingSection />}
        {!isLoading && series.length === 0 && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            Сериалы не найдены
          </h3>
        )}

      </div>
      <ModalFilm />
    </Layout.Content>
  );
};

export default AppContent;
