import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const FootballStream = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (login === "1" && password === "1") {
      navigate("/dash");
    } else if (login === "2" && password === "2") {
      navigate("/view");
    } else if (login === "3" && password === "3") {
      navigate("/calcu");
    } else {
      alert("Login yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo"></div> {/* Logo joyi */}
        <h2>Kirish</h2>
        <input 
          type="text" 
          placeholder="Login" 
          value={login} 
          onChange={(e) => setLogin(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Parol" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Kirish</button>
      </div>
    </div>
  );
};

export default FootballStream;
