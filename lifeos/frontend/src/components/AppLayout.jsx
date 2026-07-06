import Sidebar from "./Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children, title }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

export default AppLayout;
