import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("guest@smartmenu.ai");
  const [password, setPassword] = useState("Password123!");
  const navigate = useNavigate();
  async function submit(event: FormEvent) { event.preventDefault(); const response = await api.post("/auth/login", { email, password }); localStorage.setItem("smartmenuai_token", response.data.token); navigate("/menu"); }
  return <form className="auth-form" onSubmit={submit}><h1>Login</h1><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button>Login</button></form>;
}
