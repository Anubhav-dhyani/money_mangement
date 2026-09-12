import { X } from 'lucide-react';
export default function Modal({ open, title, subtitle, children, onClose, wide = false }) {
  if (!open) return null;
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className={`modal ${wide ? 'modal-wide' : ''}`}>
      <div className="modal-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-btn" onClick={onClose}><X size={20}/></button></div>
      {children}
    </section>
  </div>;
}
