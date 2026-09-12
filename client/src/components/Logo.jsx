export default function Logo({ compact = false }) {
  return <div className="brand">
    <div className="brand-mark"><span /><span /><span /><span /></div>
    {!compact && <span>EventFlow</span>}
  </div>;
}
