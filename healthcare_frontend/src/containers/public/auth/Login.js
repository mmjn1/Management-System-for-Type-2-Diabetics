import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/glucocare/vendor/bootstrap/css/bootstrap.min.css";

import { post } from "../../../utils/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      setError("");
      post("/login/", { email: username, password: password })
        .then((res) => {
          localStorage.setItem("token", res.accessToken);

          navigate("/");
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      setError("Please enter both username and password.");
    }
  };

  const commonStyle = {
    paddingTop: "200px", 
  };

  return (
    <main id="main">
      <div id="common" className="section-common" style={commonStyle}>
        <div className="container">
          <div className="row">
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h2 className="card-title text-center mb-4">Login</h2>
                      <form>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            Username:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Password:
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleLogin}
                          >
                            Login
                          </button>
                        </div>
                        {error && <p className="text-danger mt-3">{error}</p>}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
