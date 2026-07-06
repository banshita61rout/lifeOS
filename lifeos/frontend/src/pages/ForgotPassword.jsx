import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../api/axios";
import "./Auth.css";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      setSent(true);
      toast.success("Reset link generated — check your email or the backend console (dev mode).");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-brand">✨ LifeOS</div>
        <p className="auth-subtitle text-muted">Reset your password</p>

        {sent ? (
          <p style={{ textAlign: "center" }}>
            If an account exists for that email, a reset link has been generated. In local dev mode without email configured, check your backend terminal for the link.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" {...register("email", { required: true })} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login">Back to login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
