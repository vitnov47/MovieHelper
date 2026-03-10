import { useGetTopSeriesQuery } from "../api/movieApi";
import useMovieContext from "../context/movie-context";
import type { Movie, ServerResponse } from "../types/movie";
import FilmSection from "./FilmSection";
import LoadingSection from "./LoadingSection";

interface SeriesSectionProps {
  searchData: ServerResponse | undefined;
  isSearchLoading: boolean;
  isSearchError: boolean;
}

const SeriesSection = ({
  searchData,
  isSearchLoading,
  isSearchError,
}: SeriesSectionProps) => {
  const { searchTerm, isDarkMode } = useMovieContext();
  let series: Movie[] = [];
  let isLoading = false;
  let isError = false;

  const {
    data: topSeriesData,
    isLoading: isTopSeriesLoading,
    isError: isTopSeriesError,
  } = useGetTopSeriesQuery(undefined, { skip: !!searchTerm });

  if (searchTerm) {
    isLoading = isSearchLoading;
    isError = isSearchError;
    const allItems = searchData?.films || [];
    series = allItems.filter(
      (f) =>
        f.type === "TV_SERIES" ||
        f.type === "TV_SHOW" ||
        f.type === "MINI_SERIES",
    );
  } else {
    isLoading = isTopSeriesLoading;
    isError = isTopSeriesError;
    series = topSeriesData?.films || [];
  }

  return (
    <>
      {isError && "Ошибка загрузки сериалов"}

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
    </>
  );
};

export default SeriesSection;
