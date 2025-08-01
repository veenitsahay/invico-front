import {Matrix} from "./Matrix";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import SignupPage from "./SignupPage";
import React from "react";

function App() {
    return (
      <>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/matrix" element={<Matrix />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
      </>
    )
}

export default App;
