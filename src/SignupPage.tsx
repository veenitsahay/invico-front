import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [first_name, setFirst_name] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:3000/register/", {
        username,
        first_name,
        email,
        password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Google signup/login success:", credentialResponse);
    navigate("/matrix");
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create an Account
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
              Log in
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }}></Divider>

        <Box textAlign="center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;
