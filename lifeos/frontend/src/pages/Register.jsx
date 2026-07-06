import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      login(res.data.user, res.data.token);
      toast.success("Account created! Welcome to LifeOS 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
        <p className="auth-subtitle text-muted">Create your account — it's free</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label>Full Name</label>
            <input placeholder="Jane Doe" {...register("name", { required: "Name is required" })} />
            {errors.name && <div className="field-error">{errors.name.message}</div>}
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" {...register("email", { required: "Email is required" })} />
            {errors.email && <div className="field-error">{errors.email.message}</div>}
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" placeholder="At least 6 characters" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })} />
            {errors.password && <div className="field-error">{errors.password.message}</div>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
