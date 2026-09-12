import { ArrowUpRight, CalendarDays, Download, Plus, Sparkles, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

const fmtDate = (date) => new Intl.DateTimeFormat('en-IN', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(date));
export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/dashboard').then((r) => setData(r.data)).catch(() => setData({ stats:{users:0,events:0,newUsers:0,upcoming:0},recentUsers:[],recentEvents:[] })); }, []);
  const stats = data?.stats || {};
  return <div className="page-content dashboard-page">
    <section className="welcome-banner">
      <div><span className="eyebrow"><Sparkles size={14}/> WORKSPACE OVERVIEW</span><h2>Everything is ready to flow.</h2><p>Add people, organise an event, then export a clean payment-ready sheet.</p></div>
      <div className="banner-actions"><Link to="/users" className="secondary-btn"><UserPlus size={17}/> Add user</Link><Link to="/events" className="primary-btn"><Plus size={17}/> Create event</Link></div>
    </section>
    <section className="stat-grid">
      <article className="stat-card"><div className="stat-icon green"><Users/></div><span>Total users</span><strong>{data ? stats.users : '—'}</strong><small><b>+{stats.newUsers || 0}</b> this month</small></article>
      <article className="stat-card"><div className="stat-icon lavender"><CalendarDays/></div><span>Total events</span><strong>{data ? stats.events : '—'}</strong><small>All event records</small></article>
      <article className="stat-card"><div className="stat-icon orange"><ArrowUpRight/></div><span>Upcoming</span><strong>{data ? stats.upcoming : '—'}</strong><small>Scheduled events</small></article>
      <article className="stat-card dark-stat"><div><span>New users</span><strong>{data ? stats.newUsers : '—'}</strong><small>Added this month</small></div><div className="mini-bars"><i/><i/><i/><i/><i/><i/></div></article>
    </section>
    <section className="dashboard-grid">
      <article className="panel recent-panel"><div className="panel-head"><div><h2>Recent events</h2><p>Your latest participant groups</p></div><Link to="/events">View all <ArrowUpRight size={15}/></Link></div>
        <div className="event-list">
          {data?.recentEvents?.length ? data.recentEvents.map((event) => <div className="event-row" key={event._id}>
            <div className="date-tile"><strong>{new Date(event.date).getDate()}</strong><span>{new Date(event.date).toLocaleString('en',{month:'short'})}</span></div>
            <div className="event-main"><strong>{event.name}</strong><span>{event.users.length} participant{event.users.length!==1?'s':''}</span></div>
            <span className={`status ${event.status}`}>{event.status}</span><Link to="/events" className="icon-btn"><ArrowUpRight size={17}/></Link>
          </div>) : <div className="inline-empty">No events yet. Create your first event to see it here.</div>}
        </div>
      </article>
      <article className="panel people-panel"><div className="panel-head"><div><h2>Recently added</h2><p>Newest people in your directory</p></div><Link to="/users">View all</Link></div>
        <div className="people-list">{data?.recentUsers?.length ? data.recentUsers.map((user) => <div className="person-row" key={user._id}><div className="mini-avatar">{user.name.slice(0,1)}</div><div><strong>{user.name}</strong><span>{user.uniqueId} · {user.bankName}</span></div></div>) : <div className="inline-empty">Your user directory is empty.</div>}</div>
      </article>
    </section>
    <section className="flow-strip"><div><span>01</span><strong>Add your users</strong><small>Single entry or CSV upload</small></div><i/><div><span>02</span><strong>Create an event</strong><small>Select the right participants</small></div><i/><div><span>03</span><strong>Export anytime</strong><small>Download a clean Excel file</small></div><Download size={24}/></section>
  </div>;
}
