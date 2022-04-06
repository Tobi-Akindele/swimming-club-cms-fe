import React, { useEffect, useState } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faEye,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../../components/formComponents/SearchInput';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const UsersContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
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
  border: 1px solid #3bb077;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: white;
`;

const CreateUserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const CreateUserContainerTitle = styled.h1``;

const ButtonCreate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  cursor: pointer;
  color: white;
  font-size: 15px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
`;

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.user?.users);
  const currentUser = useSelector((state) => state?.login?.currentUser);
  const [query, setQuery] = useState('');

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

  const keys = ['firstName', 'lastName', 'email', 'username'];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const rows =
    users &&
    Object.entries(search(users)).map(([k, v]) => {
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
      width: 220,
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
      width: 150,
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
      field: 'activated',
      headerName: 'Activated',
      width: 150,
      renderCell: (params) => {
        return (
          <span
            style={{
              border: `1px solid ${params.row.active ? 'green' : 'red'}`,
              width: '70px',
              textAlign: 'center',
              borderRadius: '10px',
              padding: '1px',
            }}
          >
            {params.row.active ? (
              <>
                <FontAwesomeIcon icon={faCheck} style={{ color: '#3bb077' }} />{' '}
                Active
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  style={{ color: 'red' }}
                />{' '}
                Inactive
              </>
            )}
          </span>
        );
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
              <ButtonEdit>
                <FontAwesomeIcon icon={faEye} style={{ color: '#3bb077' }} />{' '}
                View
              </ButtonEdit>
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
            <CreateUserContainerTitle>Users</CreateUserContainerTitle>
            <Link to='/create/user'>
              <ButtonCreate>Create</ButtonCreate>
            </Link>
          </CreateUserContainer>
          <SearchContainer>
            <SearchInput
              type='text'
              placeholder='Search'
              onChange={(e) => setQuery(e.target.value)}
              width='300px'
            />
          </SearchContainer>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </UsersContainer>
      </Container>
    </>
  );
};

export default Users;
