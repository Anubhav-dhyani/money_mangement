import { CalendarDays, ChevronLeft, LayoutDashboard, LogOut, Menu, Search, Users, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Logo from './Logo.jsx';

const titles = { '/': ['Dashboard', 'A quick look at your workspace today.'], '/users': ['Users', 'Manage people and payment information.'], '/events': ['Events', 'Create groups and export participant records.'] };
export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('eventflow_admin') || '{}');
  const [title, subtitle] = titles[location.pathname] || titles['/'];
  const logout = () => { localStorage.clear(); navigate('/login'); };
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-head"><Logo /><button className="icon-btn mobile-only" onClick={() => setOpen(false)}><X size={19}/></button></div>
      <nav>
        <NavLink to="/" end onClick={() => setOpen(false)}><LayoutDashboard size={19}/><span>Dashboard</span></NavLink>
        <NavLink to="/users" onClick={() => setOpen(false)}><Users size={19}/><span>Users</span></NavLink>
        <NavLink to="/events" onClick={() => setOpen(false)}><CalendarDays size={19}/><span>Events</span></NavLink>
      </nav>
      <div className="sidebar-help">
        <div className="help-icon">?</div><strong>Need help?</strong><span>Check the setup guide</span>
      </div>
      <button className="logout-button" onClick={logout}><LogOut size={18}/> Log out</button>
    </aside>
    {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
    <main className="workspace">
      <header className="topbar">
        <div className="page-heading"><button className="icon-btn menu-btn" onClick={() => setOpen(true)}><Menu size={22}/></button><div><h1>{title}</h1><p>{subtitle}</p></div></div>
        <div className="top-actions">
          <div className="global-search"><Search size={18}/><input placeholder="Search workspace…" /></div>
          <div className="avatar">{(admin.name || 'A').split(' ').map((x) => x[0]).slice(0,2).join('')}</div>
          <div className="admin-label"><strong>{admin.name || 'Admin'}</strong><span>Administrator</span></div>
        </div>
      </header>
      <Outlet />
    </main>
  </div>;
}
