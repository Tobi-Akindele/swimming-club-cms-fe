import {
  faCheck,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import {
  getUserTypesFailure,
  getUserTypesStart,
  getUserTypesSuccess,
} from '../../redux/userTypeRedux';
import { setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const UserTypesContainer = styled.div`
  flex: 4;
  padding: 15px;
`;

const CreateUserTypeContainer = styled.div`
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
  cursor: not-allowed;
  color: white;
  font-size: 15px;
`;

const UserTypes = () => {
  const dispatch = useDispatch();
  const userTypes = useSelector((state) => state.userType?.userTypes);
  const currentUser = useSelector((state) => state.login?.currentUser);

  useEffect(() => {
    dispatch(getUserTypesStart());
    openRequest
      .get('/user-types', setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(getUserTypesSuccess(result.data));
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        dispatch(getUserTypesFailure());
      });
  }, [dispatch, currentUser]);

  const rows =
    userTypes &&
    Object.entries(userTypes).map(([k, v]) => {
      return {
        ...v,
        id: userTypes[k]._id,
      };
    });

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 210,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 210,
    },
    {
      field: '_created',
      headerName: 'Created',
      width: 210,
      renderCell: (params) => {
        return <span>{format(params.row._created)}</span>;
      },
    },
    {
      field: 'assignable',
      headerName: 'Status',
      width: 210,
      renderCell: (params) => {
        return (
          <span
            style={{
              border: `1px solid ${params.row.assignable ? 'green' : 'red'}`,
              width: '70px',
              textAlign: 'center',
              borderRadius: '10px',
              padding: '1px',
            }}
          >
            {params.row.assignable ? (
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
        <UserTypesContainer>
          <CreateUserTypeContainer>
            <CreateUserContainerTitle>User Types</CreateUserContainerTitle>
            <Link to='/'>
              <ButtonCreate>Create</ButtonCreate>
            </Link>
          </CreateUserTypeContainer>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </UserTypesContainer>
      </Container>
    </>
  );
};

export default UserTypes;
