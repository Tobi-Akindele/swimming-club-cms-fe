import React, { useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
} from '../../redux/userRedux';
import { toast, ToastContainer } from 'react-toastify';
import { openRequest } from '../../apiRequests';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const UsersContainer = styled.div`
  flex: 4;
  padding: 15px;
`;

const UserCellContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserCellImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;

const ButtonEdit = styled.button`
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  background-color: #3bb077;
  color: white;
  cursor: pointer;
  margin-right: 20px;
`;

const CreateUserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  margin-bottom: 5px;
`;

const ButtonCreate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  cursor: pointer;
  color: white;
  font-size: 15px;
`;

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.user?.users);
  const currentUser = useSelector((state) => state?.login?.currentUser);

  useEffect(() => {
    dispatch(getUsersStart());
    openRequest
      .get('/users', setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(getUsersSuccess(result.data));
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        dispatch(getUsersFailure());
      });
  }, [dispatch, currentUser]);

  const rows = users && Object.entries(users).map(([k, v]) => {
    return {
      ...v,
      id: users[k]._id,
    };
  });

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 210,
    },
    {
      field: 'user',
      headerName: 'User',
      width: 250,
      renderCell: (params) => {
        return (
          <UserCellContainer>
            <UserCellImg
              src={
                params.row.image ||
                'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
              }
              alt='user image'
            />
            {params.row.firstName} {params.row.lastName.toUpperCase()}
          </UserCellContainer>
        );
      },
    },
    { field: 'email', headerName: 'Email', width: 250 },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
    },
    {
      field: '_created',
      headerName: 'Registered',
      width: 120,
      renderCell: (params) => {
        return <span>{format(params.row._created)}</span>;
      },
    },
    {
      field: 'userType',
      headerName: 'User Type',
      width: 150,
      renderCell: (params) => {
        return <span>{params.row.userType.name}</span>;
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={'/user/' + params.row._id}>
              <ButtonEdit>View</ButtonEdit>
            </Link>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Topbar wMessage={false} />
      <Container>
        <ToastContainer
          position='top-center'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Sidebar />
        <UsersContainer>
          <CreateUserContainer>
            <Link to='/create/user'>
              <ButtonCreate>Create User</ButtonCreate>
            </Link>
          </CreateUserContainer>
          <DataGrid rows={rows} columns={columns} autoHeight />
        </UsersContainer>
      </Container>
    </>
  );
};

export default Users;
