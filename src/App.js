import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import CreateUser from './pages/createUser/CreateUser';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import User from './pages/user/User';
import Users from './pages/users/Users';

const App = () => {
  const { currentUser } = useSelector((state) => state.login);
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={currentUser ? <Navigate to='/dashboard' /> : <Login />}
        />
        <Route
          path='/dashboard'
          element={currentUser ? <Dashboard /> : <Navigate to='/' />}
        />
        <Route
          path='/users'
          element={currentUser ? <Users /> : <Navigate to='/' />}
        />
        <Route
          path='/user/:userId'
          element={currentUser ? <User /> : <Navigate to='/' />}
        />
        <Route
          path='/create/user'
          element={currentUser ? <CreateUser /> : <Navigate to='/' />}
        />
      </Routes>
    </Router>
  );
};

export default App;
