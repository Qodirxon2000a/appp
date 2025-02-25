import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const FootballStream = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Bo'limlar</h2>
        <button onClick={() => navigate("/dash")} className="nav-btn">Boshqaruv</button>
        <button onClick={() => navigate("/view")} className="nav-btn">Ishga Yuborish</button>
        <button onClick={() => navigate("/calcu")} className="nav-btn">Hisoblash</button>
        <button onClick={() => navigate("/money")} className="nav-btn">Oylik</button>
      </div>
    </div>
  );
};

export default FootballStream;
