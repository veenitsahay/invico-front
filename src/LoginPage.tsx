
import { useState } from "react";
import axios from "axios";
import SignupPage from "./SignupPage";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

    const handleLogin = (e: React.FormEvent) => {
          e.preventDefault();
          axios.post("http://127.0.0.1:8000/api/token/", {
               username, password })
            .then((response) => {
              console.log(response.data)
            })
            .catch((error) => {
              console.log(error.message);
            }
        )
    }


   return (

<div className="login-container">
  <div className="login-panel">
    <h2>Login Page</h2>
            <input type="text"  value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" value={password} placeholder="Password"  onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={handleLogin}> Submit</button>
  </div>
</div>

    )
};

export default LoginPage;
