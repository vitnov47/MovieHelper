export interface Movie {
  filmId?: number;
  kinopoiskId?: number;
  nameRu: string;
  nameEn?: string;
  year: string;
  posterUrlPreview: string;
  posterUrl: string;
  rating?: string;
  ratingKinopoisk?: string;
  ratingImdb?: string;
  description: string;
  genres: { genre: string }[];
  countries: { country: string }[];
  type: "FILM" | "TV_SERIES" | "MINI_SERIES" | "TV_SHOW" | "VIDEO";
}

export interface ServerResponse {
  keyword: string;
  pagesCount: number;
  films: Movie[];
  searchFilmsCountResult: number;
}
