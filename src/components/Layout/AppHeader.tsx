import { type ChangeEvent } from "react";
import { Layout, Input, Button, Grid } from "antd";
import logo from "../../assets/app_icon.png";
import mobLogo from "../../assets/app_icon_mob.png";
import "../../styles/button.css";
import HeaderButtons from "../HeaderButtons";
import useMovieContext from "../../context/movie-context";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
  const { handleSearch, contextHolder } = useMovieContext();
  const navigate = useNavigate();

  const handleChange = (value: ChangeEvent<HTMLInputElement>) => {
    if (!value.currentTarget.value.trim()) handleSearch("");
  };

  const screens = Grid.useBreakpoint();

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
        style={{
          display: "flex",
          alignItems: "center",
          padding: 0,
          paddingRight: "10px",
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        <img
          src={screens.md ? logo : mobLogo}
          alt="MovieHelper"
          style={{ height: "120%", objectFit: "contain" }}
        />
      </Button>

      <Input.Search
        placeholder="Найти..."
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
