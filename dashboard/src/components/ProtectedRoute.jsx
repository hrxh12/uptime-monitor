// Navigate = "is page par bhej do" wala component (code se redirect)
import { Navigate } from 'react-router-dom';
// token hai ya nahi — api.js ka helper
import { isLoggedIn } from '../services/api';

// darwaza: login hai to andar jaane do (children dikhao), nahi to /login bhej do
// children = jo bhi is component ke andar lapeta gaya hai (jaise <Dashboard />)
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    // replace = history mein yeh page mat rakho — back dabane par
    // wapas isi bounce mein na phase user
    return <Navigate to="/login" replace />;
  }
  return children;
}

// bahar bhejo taaki App.jsx use kar sake
export default ProtectedRoute;
