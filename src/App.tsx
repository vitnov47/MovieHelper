import { Layout } from "antd";
import AppHeader from "./components/Layout/AppHeader";
import AppContent from "./components/Layout/AppContent";
import ConfigProviderAntd from "./components/ConfigProviderAntd/ConfigProviderAntd";
import { MovieContextProvider } from "./context/movie-context";

function App() {
  return (
    <MovieContextProvider>
      <ConfigProviderAntd>
        <Layout style={{ minHeight: "100vh" }}>
          <AppHeader />
          <AppContent />
        </Layout>
      </ConfigProviderAntd>
    </MovieContextProvider>
  );
}

export default App;
