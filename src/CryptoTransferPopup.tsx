import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import QrReader from "react-qr-reader";
import {
  Box,
  Button,
  Typography,
  TextField,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

interface CryptoTransferPopupProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  isLoggedIn: boolean;
}

const CryptoTransferPopup: React.FC<CryptoTransferPopupProps> = ({
  open,
  darkMode,
  isLoggedIn,
}) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [visible, setVisible] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const theme = useTheme();
  const isDarkMode = darkMode;

  // Neon colors for modes
  const neonColor = isDarkMode ? "#00f0ff" : "#3a0ca3"; // bright cyan or dark purple neon
  const bgColor = isDarkMode
    ? "rgba(0,0,0,0.3)"
    : "rgba(255,255,255,0.15)";
  const boxShadow = isDarkMode
    ? `0 0 0px ${neonColor}80`
    : `0 0 0px ${neonColor}cc`;
  const borderColor = neonColor;

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const { data } = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd"
        );
        setConversionRate(data.tether.usd);
      } catch (err) {
        console.error("Error fetching conversion rate", err);
      }
    };
    fetchConversionRate();
  }, []);

  const handleTransfer = async () => {
    if (!walletAddress || !amount || isNaN(parseFloat(amount))) {
      setMessage("Please enter a valid wallet address and amount.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await new Promise((res) => setTimeout(res, 2000));
      setMessage(`✅ Successfully transferred ${amount} USDT to ${walletAddress}`);
      audioRef.current?.play();
    } catch (err) {
      console.error(err);
      setMessage("❌ Transfer failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = (data: string | null) => {
    if (data) {
      setWalletAddress(data);
      setShowScanner(false);
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scan Error:", err);
    setShowScanner(false);
  };

  if (!open) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src="https://notificationsounds.com/storage/sounds/file-sounds-1157-pristine.mp3"
        preload="auto"
      />

      <AnimatePresence>
<motion.div
  initial={{ x: "-100%" }}
  animate={{ x: visible ? 0 : "-calc(100% - 40px)" }}
  exit={{ x: "-100%" }}
  transition={{ type: "tween", duration: 0.4 }}
  style={{
    position: "absolute",
    top: 64,          // <-- Leave space for AppBar (height ~64px)
    left: 0,
    height: "calc(100vh - 64px)",  // <-- Full height minus AppBar
    zIndex: 1200,
    display: "flex",
    alignItems: "stretch",
  }}
>
  {visible && (
    <Draggable handle=".drag-handle" cancel="input,button">
      <Box
        sx={{
          height: "100%",   // fill the motion div height
          bgcolor: bgColor,
          color: neonColor,
          boxShadow: boxShadow,
          p: 4,
          borderRadius: "0 8px 8px 0",
          maxWidth: 400,
          width: "90vw",
          userSelect: "none",
          overflowY: "auto",  // scroll if overflow
          position: "relative",
          border: `1.5px solid ${borderColor}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          backgroundImage: `url(${isDarkMode ? "/darkmain.jpg" : "/lightmain.jpg"})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: isDarkMode
              ? "rgba(0,0,0,0.6)"
              : "rgba(255,255,255,0.6)",
            borderRadius: "0 8px 8px 0",
            zIndex: 0,
          },
        }}
      >
      {/* ... rest remains unchanged ... */}
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    className="drag-handle"
                    sx={{
                      cursor: "move",
                      mb: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      userSelect: "none",
                      color: neonColor,
                      textShadow: `0 0 0px ${neonColor}`,
                    }}
                  >
                    <Typography id="crypto-transfer-title" variant="h6" component="h2">
                      Transfer USDT
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: neonColor, textShadow: `0 0 0px ${neonColor}` }}
                    >
                      Recipient Email
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      type="email"
                      placeholder="e.g., user@example.com"
                      sx={{
                        backgroundColor: isDarkMode ? "#3a3a3a" : "rgba(255,255,255,0.8)",
                        mb: 1,
                        input: { color: neonColor },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                          boxShadow: `0 0 8px ${neonColor}`,
                        },
                      }}
                      onBlur={async (e) => {
                        const email = e.target.value;
                        try {
                          const res = await axios.get(
                            `/api/users/wallet?email=${encodeURIComponent(email)}`
                          );
                          const wallet = res.data.walletAddress;
                          if (wallet) {
                            setWalletAddress(wallet);
                            setMessage(`✅ Wallet found: ${wallet}`);
                          } else {
                            setWalletAddress("");
                            setMessage("❌ No wallet linked to this email.");
                          }
                        } catch (err) {
                          console.error(err);
                          setWalletAddress("");
                          setMessage("❌ Failed to look up wallet.");
                        }
                      }}
                    />
                  </Box>

                  {showScanner && (
                    <Box sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}>
                      <QrReader
                        constraints={{ facingMode: "environment" }}
                        onResult={(result, error) => {
                          if (result) handleScan(result.getText());
                          if (error) handleError(error);
                        }}
                        style={{ width: "100%" }}
                      />
                    </Box>
                  )}

                  {/* USDT Amount */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: neonColor, textShadow: `0 0 0px ${neonColor}` }}
                    >
                      Amount in USDT
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAmount(val);
                        if (conversionRate) {
                          const usd = parseFloat(val) * conversionRate;
                          setUsdAmount(isNaN(usd) ? "" : usd.toFixed(2));
                        }
                      }}
                      placeholder="e.g., 100.00"
                      inputProps={{ step: "0.01" }}
                      sx={{
                        backgroundColor: isDarkMode ? "#3a3a3a" : "rgba(255,255,255,0.8)",
                        mb: 2,
                        input: { color: neonColor },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                          boxShadow: `0 0 8px ${neonColor}`,
                        },
                      }}
                    />
                  </Box>

                  {/* USD Amount */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: neonColor, textShadow: `0 0 0px ${neonColor}` }}
                    >
                      Amount in USD
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      type="number"
                      value={usdAmount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUsdAmount(val);
                        if (conversionRate) {
                          const usdt = parseFloat(val) / conversionRate;
                          setAmount(isNaN(usdt) ? "" : usdt.toFixed(2));
                        }
                      }}
                      placeholder="e.g., 110.00"
                      inputProps={{ step: "0.01" }}
                      sx={{
                        backgroundColor: isDarkMode ? "#3a3a3a" : "rgba(255,255,255,0.8)",
                        mb: 2,
                        input: { color: neonColor },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: neonColor,
                          boxShadow: `0 0 8px ${neonColor}`,
                        },
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleTransfer}
                    disabled={!isLoggedIn || isLoading}
                    sx={{
                      mb: 2,
                      background: `linear-gradient(45deg, ${neonColor}, ${neonColor}99)`,
                      boxShadow: `0 0 10px ${neonColor}`,
                      color: isDarkMode ? "#fff" : "#222",
                      "&:hover": {
                        background: `linear-gradient(45deg, ${neonColor}cc, ${neonColor}ee)`,
                        boxShadow: `0 0 15px ${neonColor}`,
                      },
                    }}
                  >
                    {isLoading ? "Transferring..." : isLoggedIn ? "Transfer" : "Login First"}
                  </Button>

                  {conversionRate && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{
                        mb: 1,
                        color: neonColor,
                        textShadow: `0 0 0px ${neonColor}`,
                        userSelect: "none",
                      }}
                    >
                      1 USDT = {conversionRate} USD
                    </Typography>
                  )}

                  {message && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: message.startsWith("✅") ? "success.main" : "error.main",
                        textAlign: "center",
                        userSelect: "none",
                        textShadow: message.startsWith("✅")
                          ? `0 0 6px #00ff00`
                          : `0 0 6px #ff0000`,
                      }}
                    >
                      {message}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Draggable>
          )}

          {/* Slide Toggle Tab */}
          <Box
            onClick={() => setVisible(!visible)}
            sx={{
              position: "absolute",
              top: "50%",
              left: visible ? "100%" : "-20px",
              transform: "translateY(-50%)",
              width: 40,
              height: 80,
              bgcolor: isDarkMode ? "#444" : "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              cursor: "pointer",
              boxShadow: 3,
              zIndex: 1300,
              color: neonColor,
              textShadow: `0 0 6px ${neonColor}`,
              userSelect: "none",
            }}
          >
            <Typography variant="h6">{visible ? "←" : "→"}</Typography>
          </Box>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default CryptoTransferPopup;
