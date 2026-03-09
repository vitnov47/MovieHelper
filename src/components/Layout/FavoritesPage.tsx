import { useEffect, useState } from "react";
import { Layout, Row, Col } from "antd";
import useMovieContext from "../../context/movie-context";
import { supabase } from "../../supabaseClient";
import type { Movie } from "../../types/movie";
import LoadingSection from "../LoadingSection";
import { motion, AnimatePresence } from "framer-motion";
import FilmCard from "../FilmCard";
import type { Variants } from "framer-motion";

const cardScrollVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
    },
  },
};

const FavoritesPage = () => {
  const { isDarkMode, user } = useMovieContext();
  const [favoriteFilms, setFavoriteFilms] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const darkGradient = "linear-gradient(135deg, #14092a, #341477, #03226a)";
  const neonGradient = "linear-gradient(135deg, #5d0c96, #212ca5, #1c8fa6)";

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_likes")
        .select(
          `
          movie_id,
          movies (*) 
        `,
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Ошибка загрузки избранного:", error);
      } else if (data) {
        const films = data
          .map((item: any) => {
            const dbMovie = item.movies;
            if (!dbMovie) return null;

            return {
              kinopoiskId: dbMovie.id,
              filmId: dbMovie.id,
              nameRu: dbMovie.name_ru,
              nameEn: dbMovie.name_en,
              year: dbMovie.year,
              posterUrlPreview: dbMovie.poster_url_preview,
              posterUrl: dbMovie.poster_url,
              rating:
                dbMovie.rating === "undefined" ? "Нет оценок" : dbMovie.rating,
              description: dbMovie.description,
              genres: dbMovie.genres,
              countries: dbMovie.countries,
              type: dbMovie.type,
            } as Movie;
          })
          .filter(Boolean);

        setFavoriteFilms(films as Movie[]);
      }

      setIsLoading(false);
    };

    fetchFavorites();
  }, [user]);

  return (
    <Layout.Content
      style={{
        padding: "20px",
        paddingTop: "64px",
        minHeight: "100vh",
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
          Избранное
        </h2>

        <motion.div layout>
          <AnimatePresence mode="wait">
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Row gutter={[16, 24]}>
                {favoriteFilms?.map((f) => (
                  <Col
                    key={f.filmId || f.kinopoiskId}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={4}
                  >
                    <motion.div
                      variants={cardScrollVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                    >
                      <FilmCard film={f} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        {isLoading && <LoadingSection />}

        {!isLoading && favoriteFilms.length === 0 && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            Вы еще ничего не добавили в избранное
          </h3>
        )}
      </div>
    </Layout.Content>
  );
};

export default FavoritesPage;
