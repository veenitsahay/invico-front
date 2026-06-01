import React, { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
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
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleMode = () => setMode(mode === "dark" ? "light" : "dark");

  const appliedTheme = createTheme({ palette: { mode } });
  const isDark = appliedTheme.palette.mode === "dark";

  const openLogin = () => {
    setAuthMode("login");
    setAuthPopupOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthPopupOpen(true);
  };

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
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.7)" : "rgba(248, 250, 252, 0.8)",
            zIndex: 0,
          },
        }}
      >
        {/* AppBar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.82)" : "rgba(255, 255, 255, 0.86)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid",
            borderColor: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(148, 163, 184, 0.35)",
            zIndex: 2,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{
                color: isDark ? "#f8fafc" : "#0f172a",
                backgroundColor: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.92)",
                padding: "8px 18px",
                borderRadius: 2,
                fontWeight: 700,
                border: "1px solid",
                borderColor: isDark ? "rgba(148, 163, 184, 0.28)" : "rgba(148, 163, 184, 0.4)",
              }}
            >
              Vulmo
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton onClick={toggleMode} color="inherit">
                {isDark ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {/* Login button — outlined style */}
              <Button
                variant="outlined"
                onClick={openLogin}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(71, 85, 105, 0.35)",
                  color: isDark ? "#e2e8f0" : "#334155",
                  px: 2.5,
                  "&:hover": {
                    borderColor: "#2563eb",
                    backgroundColor: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)",
                  },
                }}
              >
                Login
              </Button>

              {/* Sign Up button — filled gradient style */}
              <Button
                variant="contained"
                onClick={openSignup}
                sx={{
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  px: 2.5,
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ pt: 10, px: 2, position: "relative", zIndex: 1 }}>
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
                color: isDark ? "#f8fafc" : "#0f172a",
                backgroundColor: isDark ? "rgba(15, 23, 42, 0.62)" : "rgba(255, 255, 255, 0.86)",
                padding: "12px 24px",
                borderRadius: 2,
                fontWeight: 700,
                border: "1px solid",
                borderColor: isDark ? "rgba(148, 163, 184, 0.24)" : "rgba(148, 163, 184, 0.42)",
                boxShadow: isDark ? "0 10px 25px rgba(2, 6, 23, 0.35)" : "0 10px 24px rgba(15, 23, 42, 0.12)",
              }}
            >
              Welcome To Vulmo by Veenit Sahay
            </Typography>
          </Box>
        </Box>

        {/* Auth Modal */}
        <AuthPopup
          open={authPopupOpen}
          initialMode={authMode}
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
