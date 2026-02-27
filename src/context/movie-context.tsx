import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { type User } from "@supabase/supabase-js";
import type { Movie } from "../types/movie";
import { message } from "antd";

interface MovieContextType {
  isDarkMode: boolean;
  searchTerm: string;
  isLogined: boolean;
  toggleTheme: () => void;
  handleSearch: (value: string) => void;
  user: User | null;
  handleGoogleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  openModal: boolean;
  pickedFilm: Movie | null;
  pickMovie: (film: Movie) => void;
  closeModal: () => void;
  toggleFavorite: (film: Movie) => Promise<void>;
  isFavorite: boolean;
  contextHolder: React.ReactElement;
}

interface MovieContextProviderProps {
  children: React.ReactNode;
}

const MovieContext = createContext<MovieContextType | null>(null);

export function MovieContextProvider({ children }: MovieContextProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [pickedFilm, setPickedFilm] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error("Ошибка входа: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Ошибка выхода: ", error);
    }
  };
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const pickMovie = (film: Movie) => {
    setPickedFilm(film);
    setOpenModal(true);
    const movieId = film.kinopoiskId || film.filmId;
    if (movieId) checkFavoriteStatus(movieId);
  };

  const closeModal = () => {
    setOpenModal(false);
    setPickedFilm(null);
  };

  const toggleFavorite = async (film: Movie) => {
    if (!user) {
      messageApi.warning(
        "Пожалуйста, войдите в аккаунт, чтобы добавлять фильмы в избранное!",
      );
      return;
    }

    const movieId = film.kinopoiskId || film.filmId;
    if (!movieId) {
      messageApi.error("У фильма нет ID");
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from("user_likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("movie_id", movieId)
        .maybeSingle();

      if (existingLike) {
        const { error } = await supabase
          .from("user_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movieId);

        if (error) throw error;
        setIsFavorite(false);
        messageApi.success("Фильм удален из избранного");
      } else {
        const { error: movieError } = await supabase.from("movies").upsert(
          {
            id: movieId,
            name_ru: film.nameRu,
            name_en: film.nameEn || null,
            year: String(film.year),
            poster_url_preview: film.posterUrlPreview,
            poster_url: film.posterUrl,
            rating: String(film.rating),
            description: film.description,
            genres: film.genres,
            countries: film.countries,
            type: film.type,
          },
          { ignoreDuplicates: true },
        );

        if (movieError) throw movieError;

        const { error: likeError } = await supabase.from("user_likes").insert({
          user_id: user.id,
          movie_id: movieId,
        });

        if (likeError) throw likeError;
        setIsFavorite(true);
        messageApi.success("Фильм добавлен в избранное");
      }
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
      messageApi.error("Произошла ошибка при сохранении. Попробуйте еще раз.");
    }
  };

  const checkFavoriteStatus = async (filmId: number) => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", filmId)
        .maybeSingle();

      if (error) {
        console.error("Ошибка при проверке статуса избранного:", error);
        return;
      }

      setIsFavorite(!!data);
    } catch (error) {
      console.error("Непредвиденная ошибка:", error);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        isDarkMode,
        searchTerm,
        isLogined: !!user,
        user,
        toggleTheme,
        handleSearch,
        handleGoogleLogin,
        handleLogout,
        openModal,
        pickedFilm,
        pickMovie,
        closeModal,
        toggleFavorite,
        isFavorite,
        contextHolder,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export default function useMovieContext() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("Контекст должен использоваться внутри провайдера");
  }

  return context;
}
