import { useSearchMoviesQuery } from "../../api/movieApi";
import { Layout } from "antd";
import "../../styles/card.css";
import useMovieContext from "../../context/movie-context";
import RecommendationsSection from "../RecommendationsSection";
import MoviesSection from "../MoviesSection";
import SeriesSection from "../SeriesSection";

const AppContent = () => {
  const { searchTerm, isDarkMode } = useMovieContext();

  const { data, isLoading, isError } = useSearchMoviesQuery(searchTerm, {
    skip: !searchTerm,
  });

  const darkGradient = "linear-gradient(135deg, #14092a, #341477, #03226a)";
  const neonGradient = "linear-gradient(135deg, #5d0c96, #212ca5, #1c8fa6)";

  return (
    <Layout.Content
      style={{
        padding: "20px",
        paddingTop: "64px",
        backgroundImage: isDarkMode ? darkGradient : neonGradient,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ color: "white" }}>
          {searchTerm ? "Результаты поиска" : "Популярное сейчас"}
        </h2>

        <MoviesSection
          searchData={data}
          isSearchError={isError}
          isSearchLoading={isLoading}
        />

        <SeriesSection
          searchData={data}
          isSearchError={isError}
          isSearchLoading={isLoading}
        />
        {!searchTerm && <RecommendationsSection />}
      </div>
    </Layout.Content>
  );
};

export default AppContent;
