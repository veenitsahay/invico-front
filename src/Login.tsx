import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Box,
  Link,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import ChatBot from "./ChatBot";
import CryptoTransferPopup from "./CryptoTransferPopup";
import GoogleLoginButton from "./GoogleLoginButton";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const appliedTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:3000/api/token/", { username, password })
      .then((response) => {
        console.log("Login success:", response.data);
        navigate("/matrix");
      })
      .catch((error) => {
        navigate("/matrix");
        console.error("Login error:", error.message);
      });
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Google login success", credentialResponse);
    navigate("/matrix");
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };
  const [popupOpen, setPopupOpen] = useState(true); // default to open

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />

      <AppBar position="static" color="default" elevation={2}>
        <Toolbar sx={{ flexWrap: "wrap", gap: 2, justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            INVICO
          </Typography>

          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexGrow: 1,
              maxWidth: 900,
              minWidth: isMobile ? "100%" : "auto",
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            {/* Google login */}
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

            {/* Login form */}
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexGrow: 1,
                minWidth: isMobile ? "100%" : "auto",
                flexWrap: isMobile ? "wrap" : "nowrap",
              }}
            >
              <TextField
                size="small"
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ minWidth: 140, flexGrow: 1 }}
                autoComplete="username"
              />
              <TextField
                size="small"
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ minWidth: 140, flexGrow: 1 }}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ whiteSpace: "nowrap" }}
              >
                Login
              </Button>
            </Box>

            {/* Sign Up button */}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/signup")}
              sx={{ whiteSpace: "nowrap" }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ position: "relative", pt: 0 }}>
<CryptoTransferPopup open={popupOpen} onClose={() => setPopupOpen(false)} darkMode={darkMode} />
        <Box
          sx={{
            flexGrow: 1,
            height: "calc(100vh - 64px)", // adjust if AppBar height changes
            backgroundImage: `url(${darkMode ? "/darkmain.jpg" : "/lightmain.jpg"})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-image 0.5s ease", // smooth transition
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: darkMode ? "#fff" : "#000",
              textShadow: darkMode ? "0 0 10px rgba(0,0,0,0.7)" : "0 0 10px rgba(255,255,255,0.7)",
              backgroundColor: darkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
              padding: "10px 20px",
              borderRadius: 2,
              transition: "color 0.3s ease, background-color 0.3s ease",
            }}
          >
            Welcome To !NVICO By Veenit Sahay
          </Typography>
        </Box>

        <ChatBot />
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;
