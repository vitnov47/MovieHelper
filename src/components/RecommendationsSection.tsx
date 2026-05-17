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

  useEffect(() => {
    const fetchRecommendationsFromServer = async () => {
      if (!user) return;

      setIsLoading(true);

      try {
        const { data: recommendations, error: rpcError } = await supabase.rpc(
          "get_recommendations",
          { target_user_id: user.id },
        );

        if (rpcError) throw rpcError;

        if (!recommendations || recommendations.length === 0) {
          setRecommendedMovies([]);
          setIsLoading(false);
          return;
        }

        const movieIds = recommendations.map(
          (r: any) => r.recommended_movie_id,
        );

        const { data: moviesData, error: moviesError } = await supabase
          .from("movies")
          .select("*")
          .in("id", movieIds);

        if (moviesError) throw moviesError;

        const finalRecommendations = movieIds
          .map((id: number) => {
            const dbMovie = moviesData.find((m: any) => m.id === id);
            if (!dbMovie) return null;

            return {
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
            } as Movie;
          })
          .filter(Boolean) as Movie[];

        setRecommendedMovies(finalRecommendations);
      } catch (error) {
        console.error("Ошибка при получении рекомендаций с сервера:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendationsFromServer();
  }, [user]);

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
