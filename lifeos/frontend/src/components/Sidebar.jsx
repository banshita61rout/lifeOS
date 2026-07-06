import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MdDashboard, MdCalendarToday, MdChecklist, MdLocalFireDepartment,
  MdBook, MdPerson, MdLogout,
} from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { to: "/calendar", label: "Calendar", icon: <MdCalendarToday /> },
  { to: "/tasks", label: "Tasks", icon: <MdChecklist /> },
  { to: "/habits", label: "Habits", icon: <MdLocalFireDepartment /> },
  { to: "/journal", label: "Journal", icon: <MdBook /> },
  { to: "/profile", label: "Profile", icon: <MdPerson /> },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <motion.aside
      className="sidebar glass-card"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="brand">
        <span className="brand-dot" /> LifeOS
      </div>

      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            <span className="sidebar-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-link logout-btn" onClick={logout}>
        <span className="sidebar-icon"><MdLogout /></span>
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;
