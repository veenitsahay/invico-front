import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface AuthPopupProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};

const mockCheckEmailExists = async (email: string): Promise<boolean> => {
  const existingEmails = ["test@example.com"];
  await new Promise((r) => setTimeout(r, 500));
  return existingEmails.includes(email);
};

const neonInputSx = {
  bgcolor: "rgba(255,255,255,0.07)",
  borderRadius: 2,
  color: "#00f0ff",
  "& .MuiInputBase-input": {
    color: "#00f0ff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00f0ff",
    boxShadow: "0 0 8px #00f0ff",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00ffff",
    boxShadow: "0 0 12px #00ffff",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00ffff",
    boxShadow: "0 0 14px #00ffff",
  },
};

const neonButtonSx = {
  background: "linear-gradient(45deg, #00f0ff, #006eff)",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: 2,
  boxShadow: "0 0 15px #00f0ff",
  "&:hover": {
    background: "linear-gradient(45deg, #00ffff, #3399ff)",
    boxShadow: "0 0 20px #00ffff",
  },
};

const AuthPopup: React.FC<AuthPopupProps> = ({ open, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState<"signin" | "signup" | "kyc">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();

  // KYC states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [docImage, setDocImage] = useState<string | null>(null);

  // Camera refs & state for KYC doc capture
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Ref to mount Google button container
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Load and render Google Sign-In button when dialog opens
  useEffect(() => {
    if (!open) return;

    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: "291491793496-5rachej73rnmbdptrkmcf855jfvilhlp.apps.googleusercontent.com",
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: theme.palette.mode === "dark" ? "filled_black" : "outline",
        size: "large",
        width: 360,
        type: "standard",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
      });
    };
  }, [open, theme.palette.mode]);

  const handleGoogleLogin = (response: any) => {
    // In real usage, verify JWT token in backend before trusting
    onLoginSuccess("googleuser@example.com");
    onClose();
  };

  const handleCheckEmail = async () => {
    const exists = await mockCheckEmailExists(email);
    if (exists) {
      onLoginSuccess(email);
      onClose();
    } else {
      setStep("signup");
    }
  };

  const handleLinkWallet = async () => {
    try {
        setStep("kyc");
      if (!(window as any).ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = "Link wallet to Invico";
      const signature = await signer.signMessage(message);

      await fetch("/api/link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, address, signature, message }),
      });

      
    } catch (err) {
      console.error("Wallet link failed:", err);
      alert("Failed to link wallet.");
    }
  };

  // Camera control functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraOn(true);
      }
    } catch (err) {
      alert("Cannot access camera");
      console.error(err);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setDocImage(dataUrl);
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleKYCSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert("Please enter your full name as per official document.");
      return;
    }
    if (!docImage) {
      alert("Please capture your official document.");
      return;
    }
    // Backend KYC verification should go here
    onLoginSuccess(email);
    onClose();
  };

  // Progress dots for the 3 steps
  const ProgressDots = () => (
    <Box sx={{ textAlign: "center", my: 1 }}>
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: step === "signin" ? "#00f0ff" : "#444",
            boxShadow: step === "signin" ? "0 0 10px #00f0ff" : "none",
          }}
        />
        {[1, 2].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#00f0ff",
              opacity: 0.4,
              animation: "dotsPulse 1.5s infinite",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: step === "signup" ? "#00f0ff" : "#444",
            boxShadow: step === "signup" ? "0 0 10px #00f0ff" : "none",
          }}
        />
        {[1, 2].map((_, i) => (
          <Box
            key={i + 3}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#00f0ff",
              opacity: 0.4,
              animation: "dotsPulse 1.5s infinite",
              animationDelay: `${(i + 3) * 0.3}s`,
            }}
          />
        ))}
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: step === "kyc" ? "#00f0ff" : "#444",
            boxShadow: step === "kyc" ? "0 0 10px #00f0ff" : "none",
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.7)"
              : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: 3,
          border: "1px solid #00f0ff",
          boxShadow: "0 0 20px #00f0ff",
          maxWidth: 400,
          mx: "auto",
        },
      }}
    >
      <AnimatePresence mode="wait">
        {step === "signin" && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <DialogTitle sx={{ textAlign: "center", color: "#00f0ff" }}>
              Login / Sign Up
            </DialogTitle>
            <DialogContent>
              <ProgressDots />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={neonInputSx}
                InputLabelProps={{ sx: { color: "#00f0ff" } }}
                type="email"
                autoFocus
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={neonInputSx}
                InputLabelProps={{ sx: { color: "#00f0ff" } }}
              />
              {error && (
                <Typography
                  sx={{ color: "#f00", mt: 1, fontWeight: "bold" }}
                  variant="body2"
                >
                  {error}
                </Typography>
              )}
              <Button
                fullWidth
                sx={neonButtonSx}
                onClick={() => {
                  if (!email) {
                    setError("Email is required");
                    return;
                  }
                  if (!validatePassword(password)) {
                    setError(
                      "Password must be 8+ chars, with uppercase, number & special char"
                    );
                    return;
                  }
                  setError("");
                  handleCheckEmail();
                }}
              >
                Continue
              </Button>

              <Box
                mt={3}
                sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                ref={googleButtonRef}
              />
            </DialogContent>
          </motion.div>
        )}

        {step === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <DialogTitle sx={{ textAlign: "center", color: "#00f0ff" }}>
              Link Wallet
            </DialogTitle>
            <DialogContent>
              <ProgressDots />
              <Typography sx={{ color: "#00f0ff", mb: 2 }}>
                Link your crypto wallet to continue.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={neonButtonSx}
                onClick={handleLinkWallet}
              >
                Link Wallet
              </Button>
            </DialogContent>
          </motion.div>
        )}

        {step === "kyc" && (
          <motion.div
            key="kyc"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <DialogTitle sx={{ textAlign: "center", color: "#00f0ff" }}>
              KYC Verification
            </DialogTitle>
            <DialogContent>
              <ProgressDots />
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={neonInputSx}
                InputLabelProps={{ sx: { color: "#00f0ff" } }}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={neonInputSx}
                InputLabelProps={{ sx: { color: "#00f0ff" } }}
              />

              {!docImage && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  {cameraOn ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                      <Button
                        startIcon={<CameraAltIcon />}
                        sx={{ mt: 1, ...neonButtonSx }}
                        onClick={captureImage}
                      >
                        Capture
                      </Button>
                      <Button
                        sx={{
                          mt: 1,
                          ml: 1,
                          backgroundColor: "#f00",
                          "&:hover": { backgroundColor: "#c00" },
                        }}
                        onClick={stopCamera}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      sx={neonButtonSx}
                      onClick={startCamera}
                    >
                      Take a Photo of your face and ID
                    </Button>
                  )}
                </Box>
              )}

              {docImage && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={docImage}
                    alt="Captured Document"
                    style={{ maxWidth: "100%", borderRadius: 8 }}
                  />
                  <Button
                    sx={{ mt: 1, ...neonButtonSx }}
                    onClick={() => {
                      setDocImage(null);
                      startCamera();
                    }}
                  >
                    Retake
                  </Button>
                </Box>
              )}

              <Button
                fullWidth
                sx={{ mt: 3, ...neonButtonSx }}
                onClick={handleKYCSubmit}
              >
                Submit KYC
              </Button>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default AuthPopup;
