import { type ChangeEvent } from "react";
import { Layout, Input, Button } from "antd";
import logo from "../../assets/app_icon.png";
import "../../styles/button.css";
import HeaderButtons from "../HeaderButtons";
import useMovieContext from "../../context/movie-context";

const AppHeader = () => {
  const { handleSearch, contextHolder } = useMovieContext();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (value: ChangeEvent<HTMLInputElement>) => {
    if (!value.currentTarget.value.trim()) handleSearch("");
  };

  return (
    <Layout.Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#001529",
        padding: "0 20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "fixed",
        width: "100%",
        zIndex: "1",
      }}
    >
      {contextHolder}
      <Button
        type="link"
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
        onClick={scrollTop}
      >
        <img
          src={logo}
          alt="MovieHelper"
          style={{ height: "50px", objectFit: "contain" }}
        />
      </Button>

      <Input.Search
        placeholder="Найти фильм или подборку..."
        onSearch={handleSearch}
        onChange={(value) => handleChange(value)}
        style={{ width: "55%", maxWidth: "700px" }}
        enterButton
        allowClear
      />

      <HeaderButtons />
    </Layout.Header>
  );
};

export default AppHeader;
