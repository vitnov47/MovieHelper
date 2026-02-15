import { Space, Button, Dropdown, Tooltip, Grid } from "antd";
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

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Избранное
        </a>
      ),
      icon: <BookOutlined />,
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Мои подборки
        </a>
      ),
      icon: <StarOutlined />,
    },
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
      style={{
        marginLeft: "20px",
      }}
    >
      <Tooltip title="Сменить тему" placement="bottom" color="#2d0f4f">
        <Button
          shape="circle"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />
      </Tooltip>
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
            <Button shape="circle" icon={<StarOutlined />} />
          </Tooltip>
          <Tooltip title="Мои подборки" placement="bottom" color="#2d0f4f">
            <Button shape="circle" icon={<BookOutlined />} />
          </Tooltip>
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
