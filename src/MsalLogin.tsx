// src/LoginButton.tsx
import { useMsal } from "@azure/msal-react";

const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect({
      scopes: ["openid", "profile", "email"],
    });
  };

  return <button onClick={handleLogin}>Login with Microsoft</button>;
};

export default LoginButton;
