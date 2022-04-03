import {
  faCheck,
  faEye,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import SearchInput from '../../components/formComponents/SearchInput';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import {
  getRolesFailure,
  getRolesStart,
  getRolesSuccess,
} from '../../redux/roleRedux';
import { setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const RolesContainer = styled.div`
  flex: 4;
  padding: 15px;
`;

const CreateRoleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const CreateRoleContainerTitle = styled.h1``;

const ButtonCreate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  cursor: pointer;
  color: white;
  font-size: 15px;
`;

const ButtonEdit = styled.button`
  border: 1px solid #3bb077;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: white;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px 0px;
`;

const Roles = () => {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.role?.roles);
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  // const [showModal, setShowModal] = useState(false);
  // const [roleId, setRoleId] = useState();

  useEffect(() => {
    dispatch(getRolesStart());
    openRequest
      .get('/roles', setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(getRolesSuccess(result.data));
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        dispatch(getRolesFailure());
      });
  }, [dispatch, currentUser]);

  const search = (data) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const rows =
    roles &&
    Object.entries(search(roles)).map(([k, v]) => {
      return {
        ...v,
        id: roles[k]._id,
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
    {
      field: 'action',
      headerName: 'Actions',
      width: 210,
      renderCell: (params) => {
        return (
          <>
            <Link to={'/role/' + params.row._id}>
              {/* name={params.row._id} onClick={openModal} */}
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

  // const openModal = (e) => {
  //   e.preventDefault();
  //   setRoleId(e.target.name);
  //   setShowModal((prev) => !prev);
  // };

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
        <RolesContainer>
          <CreateRoleContainer>
            <CreateRoleContainerTitle>Roles</CreateRoleContainerTitle>
            <Link to='/create/role'>
              <ButtonCreate>Create</ButtonCreate>
            </Link>
          </CreateRoleContainer>
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
        </RolesContainer>
        {/* <PermissionModal
          showModal={showModal}
          setShowModal={setShowModal}
          roleId={roleId}
        /> */}
      </Container>
    </>
  );
};

export default Roles;
