import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import api from "../api/axios";
import "./Auth.css";

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: data.password });
      toast.success("Password reset! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed - link may be expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="auth-brand">✨ LifeOS</div>
        <p className="auth-subtitle text-muted">Choose a new password</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label>New Password</label>
            <input type="password" {...register("password", { required: true, minLength: 6 })} />
            {errors.password && <div className="field-error">Min 6 characters required</div>}
          </div>
          <div className="auth-field">
            <label>Confirm Password</label>
            <input type="password" {...register("confirm", {
              required: true,
              validate: (v) => v === watch("password") || "Passwords do not match",
            })} />
            {errors.confirm && <div className="field-error">{errors.confirm.message}</div>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
