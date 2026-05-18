import useMovieContext from "../context/movie-context";
import { useGetRecommendationsQuery } from "../api/movieApi";
import FilmSection from "./FilmSection";
import LoadingSection from "./LoadingSection";

const RecommendationsSection = () => {
  const { user, isDarkMode } = useMovieContext();

  const { data: recommendedMovies = [], isLoading } =
    useGetRecommendationsQuery(user?.id ?? "", {
      skip: !user?.id,
    });

  if (!user) return null;

  return (
    <>
      {isLoading ? (
        <LoadingSection />
      ) : recommendedMovies.length > 0 ? (
        <>
          {isDarkMode ? (
            <hr color="#7a7a7a" style={{ marginBottom: 20 }} />
          ) : (
            <hr color="#d7d7d7" style={{ marginBottom: 20 }} />
          )}
          <FilmSection
            title="Специально для вас"
            films={recommendedMovies}
            isLoading={false}
          />
        </>
      ) : null}
    </>
  );
};

export default RecommendationsSection;
