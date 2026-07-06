import { MdLightMode, MdDarkMode, MdNotifications } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="navbar glass-card">
      <h2>{title}</h2>
      <div className="navbar-actions">
        <button className="icon-btn" title="Notifications">
          <MdNotifications />
        </button>
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
        </button>
        <div className="navbar-avatar">
          {user?.avatar ? (
            <img src={user.avatar.startsWith("http") ? user.avatar : `http://localhost:5000${user.avatar}`} alt="avatar" />
          ) : (
            <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
