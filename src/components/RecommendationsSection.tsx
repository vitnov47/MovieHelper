import { useEffect, useState } from "react";
import useMovieContext from "../context/movie-context";
import { supabase } from "../supabaseClient";
import type { Movie } from "../types/movie";
import FilmSection from "./FilmSection";
import LoadingSection from "./LoadingSection";

const RecommendationsSection = () => {
  const { user, isDarkMode } = useMovieContext();
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchRecommendationsFromServer = async () => {
      if (!user?.id || isFetching || recommendedMovies.length > 0) return;

      setIsFetching(true);
      setIsLoading(true);

      try {
        const { data: recommendedData, error: rpcError } = await supabase.rpc(
          "get_recommendations",
          { target_user_id: user.id },
        );

        if (rpcError) throw rpcError;

        if (!recommendedData || recommendedData.length === 0) {
          setRecommendedMovies([]);
          return;
        }

        const finalRecommendations = recommendedData.map((dbMovie: any) => ({
          kinopoiskId: dbMovie.id,
          filmId: dbMovie.id,
          nameRu: dbMovie.name_ru,
          nameEn: dbMovie.name_en,
          year: dbMovie.year,
          posterUrlPreview: dbMovie.poster_url_preview,
          posterUrl: dbMovie.poster_url,
          rating: dbMovie.rating,
          description: dbMovie.description,
          genres: dbMovie.genres,
          countries: dbMovie.countries,
          type: dbMovie.type,
        })) as Movie[];

        setRecommendedMovies(finalRecommendations);
      } catch (error) {
        console.error("Ошибка при получении рекомендаций:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendationsFromServer();
  }, [user?.id]);

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
