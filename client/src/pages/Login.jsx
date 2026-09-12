import { ArrowRight, CalendarCheck2, Check, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api.js';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@eventflow.local', password: 'Admin@123' });
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
    <section className="login-panel"><div className="login-card"><span className="eyebrow">ADMIN PORTAL</span><h2>Welcome back</h2><p>Enter your credentials to access the workspace.</p>
      <form onSubmit={submit}>
        <label>Email address<div className="input-wrap"><Mail size={18}/><input type="email" value={form.email} onChange={(e) => setForm({...form, email:e.target.value})} placeholder="admin@company.com" required/></div></label>
        <label>Password<div className="input-wrap"><LockKeyhole size={18}/><input type={show?'text':'password'} value={form.password} onChange={(e) => setForm({...form, password:e.target.value})} required/><button type="button" onClick={() => setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        <button className="primary-btn login-btn" disabled={loading}>{loading ? 'Signing in…' : <>Sign in <ArrowRight size={18}/></>}</button>
      </form><div className="demo-note"><span>Demo credentials are filled in for local setup.</span></div>
    </div></section>
  </div>;
}
