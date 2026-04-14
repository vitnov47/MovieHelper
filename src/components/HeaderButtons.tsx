import { Space, Button, Dropdown, Tooltip, Grid, Switch } from "antd";
import {
  UserOutlined,
  BookOutlined,
  StarOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import useMovieContext from "../context/movie-context";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";

const { useBreakpoint } = Grid;

const HeaderButtons = () => {
  const {
    isDarkMode,
    toggleTheme,
    isLogined,
    handleGoogleLogin,
    handleLogout,
  } = useMovieContext();
  const navigate = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => navigate("/favorites")}
        >
          Избранное
        </a>
      ),
      icon: <StarOutlined />,
    },
    // {
    //   key: "2",
    //   label: (
    //     <a
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       href="https://www.antgroup.com"
    //     >
    //       Мои подборки
    //     </a>
    //   ),
    // icon: <BookOutlined />,
    // },
    {
      type: "divider",
    },
    {
      key: "3",
      label: "Выйти",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const screens = useBreakpoint();
  return (
    <Space
      size="middle"
      align="center"
      style={{
        marginLeft: "20px",
      }}
    >
      <Switch
        unCheckedChildren={<MoonOutlined />}
        checkedChildren={<SunOutlined />}
        onChange={toggleTheme}
        defaultChecked={!isDarkMode}
        style={{ backgroundColor: isDarkMode ? "#000" : "#722ed1" }}
      />

      {!isLogined ? (
        <Tooltip title="Войти" placement="bottom" color="#2d0f4f">
          <Button
            shape="circle"
            onClick={handleGoogleLogin}
            icon={<LoginOutlined />}
          />
        </Tooltip>
      ) : screens.md ? (
        <>
          <Tooltip title="Избранные" placement="bottom" color="#2d0f4f">
            <Button
              shape="circle"
              icon={<StarOutlined />}
              onClick={() => navigate("/favorites")}
            />
          </Tooltip>
          {/* <Tooltip title="Мои подборки" placement="bottom" color="#2d0f4f">
            <Button shape="circle" icon={<BookOutlined />} />
          </Tooltip> */}
          <Tooltip title="Выйти" placement="bottom" color="red">
            <Button
              shape="circle"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              danger={true}
            />
          </Tooltip>
        </>
      ) : (
        <Dropdown menu={{ items }} trigger={["click", "hover"]}>
          <Button shape="circle" icon={<UserOutlined />} />
        </Dropdown>
      )}
    </Space>
  );
};

export default HeaderButtons;
