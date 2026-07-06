import "./Loader.css";

const Loader = ({ fullscreen }) => (
  <div className={fullscreen ? "loader-fullscreen" : "loader-inline"}>
    <div className="spinner" />
  </div>
);

export default Loader;
