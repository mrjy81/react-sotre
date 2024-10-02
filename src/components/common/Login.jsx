import React, { useState } from "react";
import call_api from "../../helper/interact_api";
import { BASE_URL } from "../../constants/general";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ isLogged, setIsLogged }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneCheck, setPhoneCheck] = useState(true);
  const [phone, setPhone] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}api/token/`, {
        phone,
        password,
      });
      const { access, refresh } = response.data;
      // Store tokens in localStorage or secure storage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setIsLogged(true);
      navigate("/");

      // Redirect or update state to indicate successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handlePhoneVerify = (e) => {
    let phone = e.target.value;
    let is_verified = phone.match(/^09\d{9}$/);

    if (is_verified) {
      setPhoneCheck(false);
      setUsername(phone);
    }
  };

  const handleSetPhoneNumber = (e) => {
    e.preventDefault();
    if (phoneCheck === false) {
      setPhone(username);
    }
  };

  let login = (
    <>
      <label htmlFor="text" className="form-label">
        شماره همراه
      </label>
      <input
        type="text"
        className="form-control"
        id="email"
        placeholder="شماره"
        onChange={handlePhoneVerify}
      />
      <div className="d-grid">
        <button
          className="btn btn-primary mt-4"
          disabled={phoneCheck}
          onClick={handleSetPhoneNumber}
        >
          ادامه
        </button>
      </div>
    </>
  );

  if (phone) {
    login = (
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          کلمه عبور
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="پسورد"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="d-grid">
          <button className="btn btn-primary mt-4" onClick={handleLogin}>
            ورود
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">ورود</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">{login}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
