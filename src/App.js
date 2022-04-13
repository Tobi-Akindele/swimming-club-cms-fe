import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import ChildProfile from './pages/childProfile/ChildrenProfile';
import Club from './pages/club/Club';
import Clubs from './pages/clubs/Clubs';
import Competition from './pages/competition/Competition';
import Competitions from './pages/competitions/Competitions';
import CreateClub from './pages/createClub/CreateClub';
import CreateCompetition from './pages/createCompetition/CreateCompetition';
import CreateRole from './pages/createRole/CreateRole';
import CreateUser from './pages/createUser/CreateUser';
import Dashboard from './pages/dashboard/Dashboard';
import Event from './pages/event/Event';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import Role from './pages/role/Role';
import Roles from './pages/roles/Roles';
import SetPassword from './pages/setPassword/SetPassword';
import TrainingData from './pages/trainingData/TrainingData';
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
        <Route
          path='/competition/:competitionId'
          element={currentUser ? <Competition /> : <Navigate to='/' />}
        />
        <Route
          path='/competition/:competitionId/event/:eventId'
          element={currentUser ? <Event /> : <Navigate to='/' />}
        />
        <Route
          path='/clubs'
          element={currentUser ? <Clubs /> : <Navigate to='/' />}
        />
        <Route
          path='/club/:clubId'
          element={currentUser ? <Club /> : <Navigate to='/' />}
        />
        <Route
          path='/club/:clubId/training-data/:trainingDataId'
          element={currentUser ? <TrainingData /> : <Navigate to='/' />}
        />
        <Route
          path='/create/club'
          element={currentUser ? <CreateClub /> : <Navigate to='/' />}
        />
        <Route
          path='/profile'
          element={currentUser ? <Profile /> : <Navigate to='/' />}
        />
        <Route
          path='/profile/:childId'
          element={currentUser ? <ChildProfile /> : <Navigate to='/' />}
        />
        <Route path='/set-password/:activationCode' element={<SetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
