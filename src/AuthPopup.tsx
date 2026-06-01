import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserProvider } from "ethers";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

interface AuthPopupProps {
  open: boolean;
  initialMode: "login" | "signup";
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  onSignupWalletStep?: () => void; // optional: called when SSO signup succeeds → wallet step
}

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

// ── Validation ──────────────────────────────────────────────────────────────
const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};

// ── Shared styles ───────────────────────────────────────────────────────────
const neonInputSx = {
  bgcolor: "rgba(148, 163, 184, 0.08)",
  borderRadius: 2,
  "& .MuiInputBase-input": { color: "inherit" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(148, 163, 184, 0.5)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#2563eb",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.18)",
  },
};

const neonButtonSx = {
  backgroundColor: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  borderRadius: 2,
  textTransform: "none" as const,
  boxShadow: "0 8px 18px rgba(37, 99, 235, 0.28)",
  "&:hover": {
    backgroundColor: "#1d4ed8",
    boxShadow: "0 10px 20px rgba(29, 78, 216, 0.32)",
  },
};

// ── Icons ───────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8, flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8, flexShrink: 0 }}>
    <path fill="#1877F2" d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

// ── Step indicator ──────────────────────────────────────────────────────────
const StepDots: React.FC<{ steps: string[]; current: number }> = ({ steps, current }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, my: 1.5 }}>
    {steps.map((label, i) => (
      <React.Fragment key={label}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
          <Box
            sx={{
              width: 28, height: 28, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: "bold",
              backgroundColor: i === current ? "#2563eb" : i < current ? "rgba(37, 99, 235, 0.24)" : "rgba(148, 163, 184, 0.14)",
              color: i === current ? "#ffffff" : i < current ? "#2563eb" : "#64748b",
              border: i < current ? "2px solid #2563eb" : "2px solid transparent",
              transition: "all 0.3s",
            }}
          >
            {i < current ? "✓" : i + 1}
          </Box>
          <Typography sx={{ fontSize: 9, color: i === current ? "#2563eb" : "#64748b", whiteSpace: "nowrap" }}>
            {label}
          </Typography>
        </Box>
        {i < steps.length - 1 && (
          <Box sx={{ flex: 1, height: 2, maxWidth: 40, mb: 2,
            background: i < current ? "#2563eb" : "rgba(148, 163, 184, 0.24)",
            transition: "background 0.3s",
          }} />
        )}
      </React.Fragment>
    ))}
  </Box>
);

// ── Main component ──────────────────────────────────────────────────────────
const AuthPopup: React.FC<AuthPopupProps> = ({ open, initialMode, onClose, onLoginSuccess, onSignupWalletStep }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [signupStep, setSignupStep] = useState(0);

  // Form fields — lifted to component level so sub-views never remount them
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fbLoading, setFbLoading] = useState(false);

  // KYC fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [docImage, setDocImage] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Google button refs — one for login, one for signup
  const googleLoginButtonRef = useRef<HTMLDivElement>(null);
  const googleSignupButtonRef = useRef<HTMLDivElement>(null);

  // Reset on open/mode change
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setSignupStep(0);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setDocImage(null);
    }
  }, [open, initialMode]);

  // ── Google SSO ─────────────────────────────────────────────────────────────
  // Stable callbacks so Google SDK doesn't get stale refs
  const handleGoogleLogin = useCallback((response: any) => {
    onLoginSuccess("googleuser@example.com");
    onClose();
  }, [onLoginSuccess, onClose]);

  const handleGoogleSignup = useCallback((response: any) => {
    // SSO signup succeeded — jump directly to wallet step
    setEmail("googleuser@example.com");
    setSignupStep(1);
  }, []);

  const renderGoogleButton = useCallback((ref: React.RefObject<HTMLDivElement>, callback: (r: any) => void) => {
    if (!window.google || !ref.current) return;
    // Clear previous render to avoid duplicate buttons
    ref.current.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: "291491793496-5rachej73rnmbdptrkmcf855jfvilhlp.apps.googleusercontent.com",
      callback,
      ux_mode: "popup",
    });
    window.google.accounts.id.renderButton(ref.current, {
      theme: isDark ? "filled_black" : "outline",
      size: "large",
      width: 340,
      type: "standard",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
    });
  }, [isDark]);

  // Load GSI script once
  useEffect(() => {
    if (!open) return;
    const loadAndRender = () => {
      setTimeout(() => {
        if (mode === "login") {
          renderGoogleButton(googleLoginButtonRef, handleGoogleLogin);
        } else if (mode === "signup" && signupStep === 0) {
          renderGoogleButton(googleSignupButtonRef, handleGoogleSignup);
        }
      }, 120);
    };

    if (window.google) {
      loadAndRender();
    } else {
      const existing = document.getElementById("google-gsi-script");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = loadAndRender;
        document.head.appendChild(script);
      } else {
        existing.addEventListener("load", loadAndRender);
        if (window.google) loadAndRender();
      }
    }
  }, [open, mode, signupStep, isDark, renderGoogleButton, handleGoogleLogin, handleGoogleSignup]);

  // ── Facebook SDK ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (document.getElementById("facebook-jssdk")) return;
    window.fbAsyncInit = () => {
      window.FB.init({ appId: "YOUR_FACEBOOK_APP_ID", cookie: true, xfbml: true, version: "v19.0" });
    };
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) { alert("Facebook SDK not loaded yet. Please try again."); return; }
    setFbLoading(true);
    window.FB.login(
      (response: any) => {
        setFbLoading(false);
        if (response.authResponse) {
          window.FB.api("/me", { fields: "name,email" }, (userInfo: any) => {
            onLoginSuccess(userInfo.email || "fbuser@example.com");
            onClose();
          });
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const handleFacebookSignup = () => {
    if (!window.FB) { alert("Facebook SDK not loaded yet. Please try again."); return; }
    setFbLoading(true);
    window.FB.login(
      (response: any) => {
        setFbLoading(false);
        if (response.authResponse) {
          window.FB.api("/me", { fields: "name,email" }, (userInfo: any) => {
            // SSO signup succeeded — jump to wallet step
            setEmail(userInfo.email || "fbuser@example.com");
            setSignupStep(1);
          });
        }
      },
      { scope: "public_profile,email" }
    );
  };

  // ── Camera helpers ─────────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (videoRef.current) { videoRef.current.srcObject = stream; streamRef.current = stream; setCameraOn(true); }
    } catch { alert("Cannot access camera"); }
  };
  const stopCamera = () => { streamRef.current?.getTracks().forEach((t) => t.stop()); setCameraOn(false); };
  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setDocImage(canvas.toDataURL("image/png"));
    stopCamera();
  };
  useEffect(() => () => stopCamera(), []);

  // ── Dialog paper styles ────────────────────────────────────────────────────
  const paperSx = {
    background: isDark ? "rgba(15, 23, 42, 0.88)" : "rgba(255,255,255,0.96)",
    backdropFilter: "blur(16px)",
    borderRadius: 3,
    border: "1px solid",
    borderColor: isDark ? "rgba(148, 163, 184, 0.32)" : "rgba(148, 163, 184, 0.42)",
    boxShadow: isDark ? "0 24px 48px rgba(2, 6, 23, 0.45)" : "0 20px 42px rgba(15, 23, 42, 0.2)",
    width: 420,
    maxWidth: "95vw",
  };

  // ── Tab switcher ──────────────────────────────────────────────────────────
  const ModeTabs = () => (
    <Box sx={{ display: "flex", borderBottom: "1px solid rgba(148, 163, 184, 0.26)", mb: 0 }}>
      {(["login", "signup"] as const).map((m) => (
        <Box
          key={m}
          onClick={() => { setMode(m); setError(""); setSignupStep(0); }}
          sx={{
            flex: 1, py: 1.5, textAlign: "center", cursor: "pointer",
            fontSize: 15, fontWeight: "bold", textTransform: "capitalize",
            color: mode === m ? "#2563eb" : isDark ? "#94a3b8" : "#64748b",
            borderBottom: mode === m ? "2px solid #2563eb" : "2px solid transparent",
            transition: "all 0.2s",
            "&:hover": { color: "#2563eb" },
          }}
        >
          {m === "login" ? "Login" : "Sign Up"}
        </Box>
      ))}
    </Box>
  );

  // ── SSO block — login ──────────────────────────────────────────────────────
  const LoginSSOBlock = () => (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2, "&::before, &::after": { borderColor: "rgba(148, 163, 184, 0.3)" } }}>
        <Typography variant="caption" sx={{ color: "#64748b", px: 1 }}>
          or continue with
        </Typography>
      </Divider>
      <Box ref={googleLoginButtonRef} sx={{ display: "flex", justifyContent: "center", mb: 1.5, minHeight: 44 }} />
      <Button
        fullWidth
        onClick={handleFacebookLogin}
        disabled={fbLoading}
        sx={{
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "#fff",
          color: isDark ? "#fff" : "#1877F2",
          border: "1px solid",
          borderColor: isDark ? "rgba(24,119,242,0.55)" : "#1877F2",
          borderRadius: 2,
          fontWeight: 600,
          fontSize: "0.875rem",
          textTransform: "none",
          py: 1,
          justifyContent: "center",
          "&:hover": { backgroundColor: isDark ? "rgba(24, 119, 242, 0.24)" : "#e8f0fe" },
          "&:disabled": { opacity: 0.6 },
        }}
      >
        <FacebookIcon />
        {fbLoading ? "Connecting…" : "Continue with Facebook"}
      </Button>
    </Box>
  );

  // ── SSO block — signup (navigates to wallet on success) ───────────────────
  const SignupSSOBlock = () => (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2, "&::before, &::after": { borderColor: "rgba(148, 163, 184, 0.3)" } }}>
        <Typography variant="caption" sx={{ color: "#64748b", px: 1 }}>
          or sign up with
        </Typography>
      </Divider>
      {/* Google — rendered by GSI SDK, callback jumps to wallet */}
      <Box ref={googleSignupButtonRef} sx={{ display: "flex", justifyContent: "center", mb: 1.5, minHeight: 44 }} />
      <Button
        fullWidth
        onClick={handleFacebookSignup}
        disabled={fbLoading}
        sx={{
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.72)" : "#fff",
          color: isDark ? "#fff" : "#1877F2",
          border: "1px solid",
          borderColor: isDark ? "rgba(24,119,242,0.55)" : "#1877F2",
          borderRadius: 2,
          fontWeight: 600,
          fontSize: "0.875rem",
          textTransform: "none",
          py: 1,
          justifyContent: "center",
          "&:hover": { backgroundColor: isDark ? "rgba(24, 119, 242, 0.24)" : "#e8f0fe" },
          "&:disabled": { opacity: 0.6 },
        }}
      >
        <FacebookIcon />
        {fbLoading ? "Connecting…" : "Sign up with Facebook"}
      </Button>
    </Box>
  );

  // ── LOGIN view ─────────────────────────────────────────────────────────────
  // IMPORTANT: Rendered directly (not as a child component defined inside render)
  // to prevent field remounting on each keystroke — the root cause of the shaking
  // cursor-jump bug.
  const renderLoginView = () => (
    <motion.div key="login" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.2 }}>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="Email" fullWidth margin="normal" type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={neonInputSx}
          InputLabelProps={{ sx: { color: isDark ? "#94a3b8" : "#475569" } }}
          // No autoFocus — avoids focus fight with AnimatePresence animation
          inputProps={{ autoComplete: "email" }}
        />
        <TextField
          label="Password" fullWidth margin="normal" type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={neonInputSx}
          InputLabelProps={{ sx: { color: isDark ? "#94a3b8" : "#475569" } }}
          inputProps={{ autoComplete: "current-password" }}
        />
        {error && <Typography sx={{ color: "#ff4444", mt: 0.5, fontSize: 13 }}>{error}</Typography>}

        <Button
          fullWidth sx={{ ...neonButtonSx, mt: 2 }}
          onClick={() => {
            if (!email) { setError("Email is required"); return; }
            if (!password) { setError("Password is required"); return; }
            setError("");
            onLoginSuccess(email);
            onClose();
          }}
        >
          Login
        </Button>

        <LoginSSOBlock />
      </DialogContent>
    </motion.div>
  );

  // ── SIGNUP step 0 — credentials + SSO ────────────────────────────────────
  const renderSignupCredentials = () => (
    <motion.div key="signup-creds" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
      <DialogContent sx={{ pt: 1 }}>
        <StepDots steps={["Account", "Wallet", "KYC"]} current={0} />

        <TextField
          label="Email" fullWidth margin="normal" type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={neonInputSx}
          InputLabelProps={{ sx: { color: isDark ? "#94a3b8" : "#475569" } }}
          inputProps={{ autoComplete: "email" }}
        />
        <TextField
          label="Password" fullWidth margin="normal" type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={neonInputSx}
          InputLabelProps={{ sx: { color: isDark ? "#94a3b8" : "#475569" } }}
          inputProps={{ autoComplete: "new-password" }}
        />
        <TextField
          label="Re-type Password" fullWidth margin="normal" type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={neonInputSx}
          InputLabelProps={{ sx: { color: isDark ? "#94a3b8" : "#475569" } }}
          inputProps={{ autoComplete: "new-password" }}
        />
        {error && <Typography sx={{ color: "#ff4444", mt: 0.5, fontSize: 13 }}>{error}</Typography>}

        <Button
          fullWidth sx={{ ...neonButtonSx, mt: 2 }}
          onClick={() => {
            if (!email) { setError("Email is required"); return; }
            if (!validatePassword(password)) {
              setError("Password needs 8+ chars, one uppercase, one number, one special character");
              return;
            }
            if (password !== confirmPassword) { setError("Passwords do not match"); return; }
            setError("");
            setSignupStep(1);
          }}
        >
          Continue →
        </Button>

        {/* SSO signup — on success automatically navigates to wallet step */}
        <SignupSSOBlock />
      </DialogContent>
    </motion.div>
  );

  // ── SIGNUP step 1 — link wallet ────────────────────────────────────────────
  const renderSignupWallet = () => (
    <motion.div key="signup-wallet" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
      <DialogContent sx={{ pt: 1 }}>
        <StepDots steps={["Account", "Wallet", "KYC"]} current={1} />

        <Typography sx={{ color: isDark ? "#e2e8f0" : "#1e293b", mb: 1, mt: 1 }}>
          Link your crypto wallet to continue.
        </Typography>
        <Typography sx={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)", fontSize: 13, mb: 3 }}>
          This connects your Ethereum wallet to your Vulmo account for seamless crypto transfers.
        </Typography>

        <Button
          variant="contained" fullWidth sx={neonButtonSx}
          onClick={async () => {
            try {
              if (!(window as any).ethereum) { alert("Please install MetaMask."); return; }
              const provider = new BrowserProvider((window as any).ethereum);
              const signer = await provider.getSigner();
              const address = await signer.getAddress();
              const signature = await signer.signMessage("Link wallet to Invico");
              await fetch("/api/link-wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, address, signature, message: "Link wallet to Invico" }),
              });
              setSignupStep(2);
            } catch { alert("Failed to link wallet."); }
          }}
        >
          Link Wallet
        </Button>

        <Button
          fullWidth onClick={() => setSignupStep(2)}
          sx={{ mt: 1.5, color: "#2563eb", textTransform: "none", fontSize: 13,
            "&:hover": { color: "#1d4ed8", backgroundColor: "transparent" } }}
        >
          Skip for now →
        </Button>
      </DialogContent>
    </motion.div>
  );

  // ── SIGNUP step 2 — KYC ────────────────────────────────────────────────────
  const renderSignupKYC = () => (
    <motion.div key="signup-kyc" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
      <DialogContent sx={{ pt: 1 }}>
        <StepDots steps={["Account", "Wallet", "KYC"]} current={2} />

        <TextField
          label="First Name" fullWidth margin="normal"
          value={firstName} onChange={(e) => setFirstName(e.target.value)}
          sx={neonInputSx} InputLabelProps={{ sx: { color: isDark ? "#94a3b8" : "#475569" } }}
        />
        <TextField
          label="Last Name" fullWidth margin="normal"
          value={lastName} onChange={(e) => setLastName(e.target.value)}
          sx={neonInputSx} InputLabelProps={{ sx: { color: isDark ? "#94a3b8" : "#475569" } }}
        />

        {!docImage && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            {cameraOn ? (
              <>
                <video ref={videoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 8 }} />
                <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "center" }}>
                  <Button startIcon={<CameraAltIcon />} sx={neonButtonSx} onClick={captureImage}>Capture</Button>
                  <Button onClick={stopCamera} sx={{ backgroundColor: "#dc2626", color: "#fff", borderRadius: 2, textTransform: "none", "&:hover": { backgroundColor: "#b91c1c" } }}>Cancel</Button>
                </Box>
              </>
            ) : (
              <Button sx={{ ...neonButtonSx, width: "100%" }} onClick={startCamera}>
                <CameraAltIcon sx={{ mr: 1 }} /> Take Photo of Face &amp; ID
              </Button>
            )}
          </Box>
        )}

        {docImage && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img src={docImage} alt="Captured" style={{ maxWidth: "100%", borderRadius: 8, border: "1px solid #94a3b8" }} />
            <Button sx={{ mt: 1, ...neonButtonSx }} onClick={() => { setDocImage(null); startCamera(); }}>Retake</Button>
          </Box>
        )}

        <Button
          fullWidth sx={{ mt: 3, ...neonButtonSx }}
          onClick={() => {
            if (!firstName.trim() || !lastName.trim()) { alert("Please enter your full name."); return; }
            if (!docImage) { alert("Please capture your document."); return; }
            onLoginSuccess(email);
            onClose();
          }}
        >
          Complete Sign Up
        </Button>
      </DialogContent>
    </motion.div>
  );

  const signupStepRenders = [renderSignupCredentials, renderSignupWallet, renderSignupKYC];

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: paperSx }}>
      <ModeTabs />

      <DialogTitle sx={{ textAlign: "center", color: isDark ? "#e2e8f0" : "#0f172a", pb: 0, pt: 2, fontSize: 18, fontWeight: "bold" }}>
        {mode === "login"
          ? "Welcome back"
          : signupStep === 0 ? "Create your account" : signupStep === 1 ? "Link your wallet" : "Identity verification"}
      </DialogTitle>

      <AnimatePresence mode="wait">
        {mode === "login" ? renderLoginView() : signupStepRenders[signupStep]()}
      </AnimatePresence>
    </Dialog>
  );
};

export default AuthPopup;
