import React, { useState } from "react";
import { Drawer, Menu } from "antd";
import {
  HomeOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { UserAuth } from "../Context API/AuthContext";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await logOut();
      // Redirect to the login page after successful logout
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvatarClick = () => {
    setShowMenu(!showMenu);
  };

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, text: "Intern List", to: "/" },
    {
      key: "2",
      icon: <PlayCircleOutlined />,
      text: "Exercises",
      to: "/exercises",
    },
    { key: "3", icon: <ClockCircleOutlined />, text: "Time", to: "/time" },
    { key: "4", icon: <PhoneOutlined />, text: "Contact", to: "/contact" },
  ];

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: "#333333" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Grid container alignItems="center">
              <Grid item xs={1}>
                {user?.displayName && (
                  <IconButton
                    style={{ color: "white" }}
                    aria-label="open drawer"
                    edge="start"
                    onClick={() => setDrawerOpen(true)}
                  >
                    ☰
                  </IconButton>
                )}
              </Grid>
              <Grid item xs={2}>
                <Link to="/">
                  <img
                    src="https://amazingtech.vn/Content/amazingtech/assets/img/logo-white.png"
                    alt="logo"
                    width="150"
                    height="40"
                    style={{ backgroundColor: "transparent" }}
                  />
                </Link>
              </Grid>
              <Grid item xs={9}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    position: "relative",
                  }}
                >
                  {user?.displayName ? (
                    <div style={{ marginLeft: "auto" }}>
                      <Tooltip title="User Profile">
                        <IconButton
                          style={{ padding: 0, color: "white" }}
                          onClick={handleAvatarClick}
                        >
                          <Avatar alt={user.displayName} src={user.photoURL} />
                        </IconButton>
                      </Tooltip>
                      <div style={{ backgroundColor: "blue" }}>
                        {showMenu && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              right: 0,
                            }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              style={{
                                margin: "8px 0",
                                color: "white",
                                backgroundColor: "blue", // Set background color
                                display: "block",
                                transition: "background-color 0.3s", // Add transition effect
                              }}
                              color="secondary"
                              onClick={() => navigate("/dashboard")}
                            >
                              Profile
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              style={{
                                margin: "8px 0",
                                color: "white",
                                backgroundColor: "red", // Set background color
                                display: "block",
                                transition: "background-color 0.3s", // Add transition effect
                              }}
                              color="secondary"
                              onClick={handleSignOut}
                            >
                              Logout
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <Button
                        variant="contained"
                        style={{
                          margin: "8px 0",
                          color: "white",
                          display: "block",
                        }}
                        color="secondary"
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        title="Navigation"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        visible={drawerOpen}
      >
        <Menu
          theme="light"
          mode="vertical"
          onClick={() => setDrawerOpen(false)}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.to}>{item.text}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
      <div style={{ height: 1, backgroundColor: "#ccc" }}></div>
    </div>
  );
};

export default Navigation;
