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
    const fetchAndCalculateRecommendations = async () => {
      if (!user) return;

      setIsLoading(true);

      const { data, error } = await supabase.from("user_likes").select(`
          user_id,
          movie_id,
          movies (*)
        `);

      if (error || !data) {
        console.error("Ошибка при загрузке данных для рекомендаций:", error);
        setIsLoading(false);
        return;
      }

      const userLikesMap: Record<string, Set<number>> = {};
      const moviesDataMap: Record<number, any> = {};

      data.forEach((item: any) => {
        if (!userLikesMap[item.user_id]) {
          userLikesMap[item.user_id] = new Set();
        }
        userLikesMap[item.user_id].add(item.movie_id);
        if (item.movies) {
          moviesDataMap[item.movie_id] = item.movies;
        }
      });

      const myLikes = userLikesMap[user.id] || new Set();

      if (myLikes.size === 0) {
        setIsLoading(false);
        return;
      }

      const userSimilarities: { userId: string; score: number }[] = [];

      for (const [otherUserId, otherLikes] of Object.entries(userLikesMap)) {
        if (otherUserId === user.id) continue;
        const intersection = new Set(
          [...myLikes].filter((x) => otherLikes.has(x)),
        );
        const union = new Set([...myLikes, ...otherLikes]);
        const jaccardScore = intersection.size / union.size;
        if (jaccardScore > 0) {
          userSimilarities.push({ userId: otherUserId, score: jaccardScore });
        }
      }

      const movieScores: Record<number, number> = {};

      userSimilarities.forEach((similarUser) => {
        const theirLikes = userLikesMap[similarUser.userId];

        theirLikes.forEach((movieId) => {
          if (!myLikes.has(movieId)) {
            movieScores[movieId] =
              (movieScores[movieId] || 0) + similarUser.score;
          }
        });
      });

      const sortedRecommendedMovieIds = Object.entries(movieScores)
        .sort((a, b) => b[1] - a[1])
        .map(([movieId]) => Number(movieId));

      const finalRecommendations = sortedRecommendedMovieIds
        .map((movieId) => {
          const dbMovie = moviesDataMap[movieId];
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
      setIsLoading(false);
    };

    fetchAndCalculateRecommendations();
  }, [user]);

  // Если юзер не залогинен, не показываем секцию
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
