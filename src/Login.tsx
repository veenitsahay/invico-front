import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

import ChatBot from "./ChatBot";
import CryptoTransferPopup from "./CryptoTransferPopup";
import AuthPopup from "./AuthPopup";

const LoginPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  const appliedTheme = createTheme({
    palette: {
      mode,
    },
  });

  const theme = useTheme();
  const isDark = appliedTheme.palette.mode === "dark";

  return (
<ThemeProvider theme={appliedTheme}>
  <CssBaseline />

  <Box
    sx={{
      minHeight: "100vh",
      backgroundImage: `url(${isDark ? "/darkmain.jpg" : "/lightmain.jpg"})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* AppBar */}
    <AppBar position="fixed" elevation={2} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{
                                      color: isDark ? "#fff" : "#000",   // white in dark, black in light
                                      textShadow: isDark ? "0 0 10px rgba(0,0,0,0.7)" : "none",
                                      backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
                                      padding: "12px 24px",
                                      borderRadius: 2,
                                      fontWeight: "bold",
                                      boxShadow: "0 0 25px rgba(0, 240, 255, 0.3)",
                                    }}>
          INVINCO
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={toggleMode} color="inherit">
            {isDark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Button
            variant="contained"
            onClick={() => setAuthPopupOpen(true)}
            sx={{
              borderRadius: 3,
              fontWeight: "bold",
              textTransform: "none",
              background: "linear-gradient(45deg, #00f0ff, #006eff)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#00f0ff",
                boxShadow: "0 0 15px #00f0ff",
              },
            }}
          >
            Login / Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>

    {/* Page Content Below AppBar */}
    <Box sx={{ pt: 10, px: 2 }}>
      <CryptoTransferPopup
        open={true}
        onClose={() => {}}
        darkMode={isDark}
        isLoggedIn={isLoggedIn}
      />

      <Box
        sx={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            textShadow: "0 0 10px rgba(0,0,0,0.7)",
            backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
            padding: "12px 24px",
            borderRadius: 2,
            fontWeight: "bold",
            boxShadow: "0 0 25px rgba(0, 240, 255, 0.3)",
          }}
        >
          Welcome To INVINCO by Veenit Sahay
        </Typography>
      </Box>
    </Box>

    {/* Auth Modal */}
    <AuthPopup
      open={authPopupOpen}
      onClose={() => setAuthPopupOpen(false)}
      onLoginSuccess={(email: string) => {
        setIsLoggedIn(true);
        setAuthPopupOpen(false);
      }}
    />

    <ChatBot />
  </Box>
</ThemeProvider>
  );
};

export default LoginPage;
