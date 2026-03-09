import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import AppHeader from "./components/Layout/AppHeader";
import AppContent from "./components/Layout/AppContent";
import FavoritesPage from "./components/Layout/FavoritesPage";
import ConfigProviderAntd from "./components/ConfigProviderAntd/ConfigProviderAntd";
import { MovieContextProvider } from "./context/movie-context";
import ModalFilm from "../src/components/ModalFilm";

function App() {
  return (
    <MovieContextProvider>
      <ConfigProviderAntd>
        <BrowserRouter>
          <Layout style={{ minHeight: "100vh" }}>
            <AppHeader />
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
            <ModalFilm />
          </Layout>
        </BrowserRouter>
      </ConfigProviderAntd>
    </MovieContextProvider>
  );
}

export default App;
