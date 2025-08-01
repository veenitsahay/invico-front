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
  darkMode: boolean;  // new prop
}

const CryptoTransferPopup: React.FC<CryptoTransferPopupProps> = ({ open, darkMode }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [visible, setVisible] = useState(true); // panel state

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const theme = useTheme();
  const isDarkMode = darkMode; // use passed prop instead of theme palette

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
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1200,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {/* Panel Content */}
          {visible && (
            <Draggable handle=".drag-handle" cancel="input,button">
              <Box
                sx={{
                  height: "100%",
                  bgcolor: isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)",
                  color: isDarkMode ? "white" : "#2e2e2e",
                  boxShadow: 6,
                  p: 4,
                  borderRadius: "0 8px 8px 0",
                  maxWidth: 400,
                  width: "90vw",
                  userSelect: "none",
                  overflowY: "auto",
                  position: "relative",

                  // Add background image based on darkMode prop
                  backgroundImage: `url(${isDarkMode ? "/darkmain.jpg" : "/lightmain.jpg"})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  // Optional: overlay with slight transparency for better readability
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
                {/* To ensure text/content is above the overlay */}
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
                    }}
                  >
                    <Typography id="crypto-transfer-title" variant="h6" component="h2">
                      Crypto P2P Transfer
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Destination Wallet Address
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="e.g., 0xABC123..."
                        sx={{ backgroundColor: isDarkMode ? "#3a3a3a" : "white" }}
                      />
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => setShowScanner(!showScanner)}
                        aria-label="Toggle QR code scanner"
                      >
                        📷
                      </Button>
                    </Box>
                  </Box>

                  {showScanner && (
                    <Box sx={{ mb: 2 }}>
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

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Amount in USDT
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g., 100.00"
                      inputProps={{ step: "0.01" }}
                      sx={{ backgroundColor: isDarkMode ? "#3a3a3a" : "white" }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleTransfer}
                    disabled={isLoading}
                    sx={{ mb: 2 }}
                  >
                    {isLoading ? "Transferring..." : "Transfer Now"}
                  </Button>

                  {conversionRate && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mb: 1 }}
                    >
                      1 USDT = {conversionRate} USD (via CoinGecko)
                    </Typography>
                  )}

                  {message && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        color: message.startsWith("✅") ? "success.main" : "error.main",
                        textAlign: "center",
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
