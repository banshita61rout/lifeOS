import "./EmptyState.css";

const EmptyState = ({ icon = "📭", title = "Nothing here yet", subtitle = "" }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h4>{title}</h4>
    {subtitle && <p className="text-muted">{subtitle}</p>}
  </div>
);

export default EmptyState;
