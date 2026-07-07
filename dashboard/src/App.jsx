// react-router se Routes (rasta chunne wala) aur Route (ek rasta = ek page)
import { Routes, Route } from 'react-router-dom';
// saare pages
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MonitorDetail from './pages/MonitorDetail';
// bina login ke private pages na khulen — iske liye darwaza
import ProtectedRoute from './components/ProtectedRoute';

// App ka kaam ab sirf ek: URL dekho, sahi page dikhao
function App() {
  return (
    <Routes>
      {/* / = landing (marketing) page */}
      <Route path="/" element={<Landing />} />
      {/* auth pages — signup/login, backend se token milta hai */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* private pages — ProtectedRoute mein lapete hue: bina token /login bhej deta hai */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* :id = URL ka badalne wala hissa (har monitor ki apni id) */}
      <Route
        path="/monitor/:id"
        element={
          <ProtectedRoute>
            <MonitorDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// component bahar bhejo
export default App;
