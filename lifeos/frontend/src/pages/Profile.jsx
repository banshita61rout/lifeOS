import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";
import "./Auth.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name } });
  const { register: registerPw, handleSubmit: handlePwSubmit, reset: resetPw } = useForm();

  const onSave = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);
      const res = await api.put("/users/me", formData, { headers: { "Content-Type": "multipart/form-data" } });
      updateUser(res.data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const onChangePassword = async (data) => {
    try {
      await api.put("/users/change-password", data);
      toast.success("Password changed");
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <AppLayout>
      <Navbar title="Profile" />
      <motion.div className="glass-card profile-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-avatar-row">
          <div className="profile-avatar-big">
            {user?.avatar ? <img src={`http://localhost:5000${user.avatar}`} alt="avatar" /> : user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user?.name}</h3>
            <p className="text-muted">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSave)}>
          <div className="auth-field">
            <label>Full Name</label>
            <input {...register("name")} />
          </div>
          <div className="auth-field">
            <label>Avatar</label>
            <input type="file" accept="image/*" {...register("avatar")} />
          </div>
          <button className="btn btn-primary" type="submit">Save Changes</button>
        </form>
      </motion.div>

      <motion.div className="glass-card profile-card" style={{ marginTop: 20 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 style={{ marginBottom: 16 }}>Change Password</h3>
        <form onSubmit={handlePwSubmit(onChangePassword)}>
          <div className="auth-field">
            <label>Current Password</label>
            <input type="password" {...registerPw("currentPassword", { required: true })} />
          </div>
          <div className="auth-field">
            <label>New Password</label>
            <input type="password" {...registerPw("newPassword", { required: true, minLength: 6 })} />
          </div>
          <button className="btn btn-primary" type="submit">Update Password</button>
        </form>
      </motion.div>
    </AppLayout>
  );
};

export default Profile;
