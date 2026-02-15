import React from "react";
import { ConfigProvider, theme } from "antd";
import useMovieContext from "../../context/movie-context";

interface ConfigProviderAntdProps {
  children: React.ReactNode;
}

const ConfigProviderAntd = ({ children }: ConfigProviderAntdProps) => {
  const { isDarkMode } = useMovieContext();
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { colorPrimary: "#722ed1", fontFamily: "Rubik, sans-serif" },
        components: {
          Carousel: {
            arrowOffset: -25,
            arrowSize: 18,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ConfigProviderAntd;
