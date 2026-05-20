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
        const allFilms = [];

        for (const page of pages) {
          const result = await fetchWithBQ(
            `/v2.2/films/collections?type=TOP_POPULAR_MOVIES&page=${page}`,
          );

          if (result.error) {
            return { error: result.error as any };
          }

          allFilms.push(...(result.data as any).items);

          if (page !== pages[pages.length - 1]) {
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        }

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
        const allFilms = [];

        for (const page of pages) {
          const result = await fetchWithBQ(
            `/v2.2/films/collections?type=POPULAR_SERIES&page=${page}`,
          );

          if (result.error) {
            return { error: result.error as any };
          }

          allFilms.push(...(result.data as any).items);

          if (page !== pages[pages.length - 1]) {
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        }

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

    getRecommendations: builder.query<Movie[], string>({
      async queryFn(userId) {
        try {
          const response = await fetch(
            `https://teardrop47.ru/api/recommendations/${userId}`,
          );

          if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
          }

          const recommendedMovies = await response.json();
          return { data: recommendedMovies as Movie[] };
        } catch (err: any) {
          return {
            error: { status: "FETCH_ERROR", error: err.message } as any,
          };
        }
      },
    }),
  }),
});

function calculateRating(rating: string | undefined): string {
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
  useGetRecommendationsQuery,
} = movieApi;
