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
  isFavoriteLoading: boolean;
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
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
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
        options: { redirectTo: window.location.origin },
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
    setIsFavorite(false);
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
      const res = await fetch("https://teardrop47.ru/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          film: film,
        }),
      });

      if (!res.ok) throw new Error("Не удалось переключить статус");

      const data = await res.json();

      setIsFavorite(data.isFavorite);
      messageApi.success(data.message);
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
    setIsFavoriteLoading(true);
    try {
      const res = await fetch(
        `https://teardrop47.ru/api/favorites/check?userId=${user.id}&movieId=${filmId}`,
      );

      if (!res.ok) throw new Error("Ошибка проверки");

      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error("Ошибка при проверке статуса избранного:", error);
      setIsFavorite(false);
    } finally {
      setIsFavoriteLoading(false);
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
        isFavoriteLoading,
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
