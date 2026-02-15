import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ServerResponse, Movie } from "../types/movie";

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://kinopoiskapiunofficial.tech/api/",
    prepareHeaders: (headers) => {
      headers.set("X-API-KEY", "6ccd1a47-b10b-4944-8ba5-bdde5501af1d");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    searchMovies: builder.query<ServerResponse, string>({
      query: (keyword) =>
        `v2.1/films/search-by-keyword?keyword=${encodeURIComponent(keyword)}&page=1`,
      transformResponse: (response: ServerResponse) => {
        return {
          ...response,
          films: response.films.map((film: Movie) => ({
            ...film,
            rating: calculateRating(film.rating),
          })),
        };
      },
    }),
    getTopMovies: builder.query<ServerResponse, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const pages = [1, 2, 3];
        const results = await Promise.all(
          pages.map((page) =>
            fetchWithBQ(
              `/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=${page}`,
            ),
          ),
        );

        const error = results.find((r) => r.error);
        if (error) return { error: error.error as any };

        const allFilms = results.flatMap((r) => (r.data as any).items);
        return {
          data: {
            films: allFilms,
            pagesCount: 3,
            keyword: " ",
            searchFilmsCountResult: allFilms.length,
          } as ServerResponse,
        };
      },
    }),
    getTopSeries: builder.query<ServerResponse, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const pages = [1, 2, 3];
        const results = await Promise.all(
          pages.map((page) =>
            fetchWithBQ(
              `/v2.2/films/collections?type=POPULAR_SERIES&page=${page}`,
            ),
          ),
        );

        const error = results.find((r) => r.error);
        if (error) return { error: error.error as any };

        const allFilms = results.flatMap((r) => (r.data as any).items);
        return {
          data: {
            films: allFilms,
            pagesCount: 3,
            keyword: " ",
            searchFilmsCountResult: allFilms.length,
          } as ServerResponse,
        };
      },
    }),
  }),
});

function calculateRating(rating: string): string {
  if (!rating || rating === "null") return "0";
  if (rating.includes("%")) {
    return rating.replace("%", "");
  }

  if (rating.includes("NOTE")) {
    const match = rating.match(/(\d+\.\d+)/);
    if (match && match[0]) return match[0];
    return "0";
  }

  return rating;
}

export const {
  useSearchMoviesQuery,
  useGetTopMoviesQuery,
  useGetTopSeriesQuery,
} = movieApi;
