import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { IconButton } from "@mui/material";

const GoogleLoginButton = ({ onSuccess, onError }: { onSuccess: (tokenResponse: any) => void; onError: () => void }) => {
  const login = useGoogleLogin({
    onSuccess,
    onError,
  });

  return (
    <IconButton
      onClick={() => login()}
      aria-label="Login with Google"
      sx={{ p: 0 }}
    >
      <img
        src="/google.png"
        alt="Google Login"
        style={{ width: 32, height: 32 }}
      />
    </IconButton>
  );
};

export default GoogleLoginButton;
