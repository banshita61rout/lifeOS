import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-brand">✨ LifeOS</div>
        <p className="auth-subtitle text-muted">Sign in to your digital life assistant</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
            {errors.email && <div className="field-error">{errors.email.message}</div>}
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="••••••••" {...register("password", { required: "Password is required" })} />
            {errors.password && <div className="field-error">{errors.password.message}</div>}
          </div>
          <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">or</div>
        <button className="btn btn-outline google-btn" onClick={() => toast("Configure VITE_GOOGLE_CLIENT_ID in .env to enable Google Sign-In", { icon: "ℹ️" })}>
          Continue with Google
        </button>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
