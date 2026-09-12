import { ArrowRight, CalendarCheck2, Check, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api.js';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const { data } = await api.post('/auth/login', form); localStorage.setItem('eventflow_token', data.token); localStorage.setItem('eventflow_admin', JSON.stringify(data.admin)); navigate('/'); }
    catch (error) { toast.error(error.response?.data?.message || 'Unable to connect to the server.'); }
    finally { setLoading(false); }
  };
  return <div className="login-page">
    <section className="login-story">
      <Logo />
      <div className="story-copy"><span className="eyebrow">Simple. Secure. Organised.</span><h1>Events and payouts,<br/>in one calm place.</h1><p>Keep participant details accurate, build event lists in moments, and export clean records whenever you need them.</p>
        <div className="story-points"><span><Check size={16}/> Secure admin workspace</span><span><Check size={16}/> Reliable Excel exports</span></div>
      </div>
      <div className="login-visual"><div className="visual-date"><CalendarCheck2/><span><strong>28</strong>Participants</span></div><div className="visual-lines"><i/><i/><i/><i/></div><span className="visual-pill">Ready to export</span></div>
      <small>© 2026 EventFlow. Built for focused teams.</small>
    </section>
    <section className="login-panel">
      <div className="mobile-login-hero">
        <div className="mobile-login-nav"><Logo /><span><ShieldCheck size={17}/> Secure</span></div>
        <div className="mobile-login-heading"><span>ADMIN WORKSPACE</span><h1>Keep every event<br/>moving forward.</h1><p>Your people, events and exports—organised in one place.</p></div>
        <div className="mobile-flow-card">
          <div className="mobile-flow-top"><span>Workspace flow</span><strong>Ready</strong></div>
          <div className="mobile-flow-steps"><i className="done"><Check size={12}/></i><b/><i className="active"><UsersRound size={13}/></i><b/><i><CalendarCheck2 size={13}/></i></div>
          <div className="mobile-flow-labels"><span>Users</span><span>Events</span><span>Export</span></div>
        </div>
      </div>
      <div className="login-card"><span className="eyebrow">ADMIN PORTAL</span><h2>Welcome back</h2><p>Enter your credentials to access the workspace.</p>
      <form onSubmit={submit} autoComplete="off">
        <label>Email address<div className="input-wrap"><Mail size={18}/><input type="email" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} placeholder="admin@company.com" autoComplete="off" required/></div></label>
        <label>Password<div className="input-wrap"><LockKeyhole size={18}/><input type={show?'text':'password'} value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} autoComplete="new-password" required/><button type="button" onClick={() => setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        <button className="primary-btn login-btn" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight size={18}/></>}</button>
      </form>
    </div></section>
  </div>;
}
