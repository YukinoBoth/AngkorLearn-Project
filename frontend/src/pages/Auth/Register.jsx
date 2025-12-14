// src/pages/Auth/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    const res = await register({ name, email, password });
    if (res.ok) nav("/dashboard");
    else setErr(res.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>
        {err && <div className="err">{err}</div>}
        <form onSubmit={submit}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          <button className="btn" type="submit">Create account</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
