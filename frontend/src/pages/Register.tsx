import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function submit(event: FormEvent) { event.preventDefault(); const response = await api.post("/auth/register", { email, password }); localStorage.setItem("smartmenuai_token", response.data.token); navigate("/menu"); }
  return <form className="auth-form" onSubmit={submit}><h1>Register</h1><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label><button>Create Account</button></form>;
}
