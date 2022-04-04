import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Competitions from './pages/competitions/Competitions';
import CreateCompetition from './pages/createCompetition/CreateCompetition';
import CreateRole from './pages/createRole/CreateRole';
import CreateUser from './pages/createUser/CreateUser';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Role from './pages/role/Role';
import Roles from './pages/roles/Roles';
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
        <Route
          path='/roles'
          element={currentUser ? <Roles /> : <Navigate to='/' />}
        />
        <Route
          path='/create/role'
          element={currentUser ? <CreateRole /> : <Navigate to='/' />}
        />
        <Route
          path='/role/:roleId'
          element={currentUser ? <Role /> : <Navigate to='/' />}
        />
        <Route
          path='/competitions'
          element={currentUser ? <Competitions /> : <Navigate to='/' />}
        />
        <Route
          path='/create/competition'
          element={currentUser ? <CreateCompetition /> : <Navigate to='/' />}
        />
        <Route path='/set-password/:activationCode' element={<SetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
