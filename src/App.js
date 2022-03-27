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
import SetPassword from './pages/setPassword/SetPassword';
import User from './pages/user/User';
import Users from './pages/users/Users';
import UserTypes from './pages/userTypes/UserTypes';

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
        <Route
          path='/user-types'
          element={currentUser ? <UserTypes /> : <Navigate to='/' />}
        />
        <Route path='/set-password/:activationCode' element={<SetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
