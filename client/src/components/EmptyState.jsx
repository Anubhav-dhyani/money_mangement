export default function EmptyState({ icon: Icon, title, text, action }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={25}/></div><h3>{title}</h3><p>{text}</p>{action}</div>;
}
