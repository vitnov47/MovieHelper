import { createContext, useState, useContext, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import type { Movie } from "../types/movie";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Ошибка входа: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
  };

  const closeModal = () => {
    setOpenModal(false);
    setPickedFilm(null);
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
