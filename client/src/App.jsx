import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Events from './pages/Events.jsx';

const authenticated = () => Boolean(localStorage.getItem('eventflow_token'));
function Protected({ children }) { return authenticated() ? children : <Navigate to="/login" replace />; }

export default function App() {
  return <Routes>
    <Route path="/login" element={authenticated() ? <Navigate to="/" replace /> : <Login />} />
    <Route element={<Protected><Layout /></Protected>}>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="events" element={<Events />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
