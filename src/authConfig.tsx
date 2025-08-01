// src/authConfig.ts
export const msalConfig = {
  auth: {
    clientId: "YOUR_CLIENT_ID",
    authority: "https://login.microsoftonline.com/common", // or tenant ID
    redirectUri: "http://localhost:3000", // should match Azure app registration
  },
};
