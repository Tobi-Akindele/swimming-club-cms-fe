import {
  faEye,
  faLock,
  faLockOpen,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
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
  deleteCompetitionsFailure,
  deleteCompetitionsStart,
  deleteCompetitionsSuccess,
  getCompetitionsFailure,
  getCompetitionsStart,
  getCompetitionsSuccess,
} from '../../redux/competitionRedux';
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

const DeleteContainer = styled.div`
  display: flex;
  margin: 15px 0px;
  justify-content: flex-end;
`;

const ButtonDelete = styled.button`
  border: none;
  padding: 10px;
  background-color: red;
  margin: 0px 10px;
  cursor: pointer;
  color: white;
  font-size: 15px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const Competitions = () => {
  const dispatch = useDispatch();
  const { competitions, isFetching: isDeleting } = useSelector(
    (state) => state.competition
  );
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    dispatch(getCompetitionsStart());
    openRequest
      .get('/competitions', setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(getCompetitionsSuccess(result.data));
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        dispatch(getCompetitionsFailure());
      });
  }, [dispatch, currentUser]);

  const search = (data) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const rows =
    competitions &&
    Object.entries(search(competitions)).map(([k, v]) => {
      return {
        ...v,
        id: competitions[k]._id,
      };
    });

  const handleDelete = (e) => {
    e.preventDefault();
    const payload = {
      competitionIds: selectedRows,
    };
    dispatch(deleteCompetitionsStart());
    openRequest
      .post(
        '/competitions/delete',
        payload,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        dispatch(deleteCompetitionsSuccess(selectedRows));
        toast.success('Deleted successfully');
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        dispatch(deleteCompetitionsFailure());
      });
  };

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
      field: 'date',
      headerName: 'Date',
      width: 210,
      renderCell: (params) => {
        return (
          <span>
            {moment(params.row.date).format('MMM Do YYYY')} (
            <span style={{ fontWeight: '1000' }}>
              {format(params.row.date)})
            </span>
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 210,
      renderCell: (params) => {
        return (
          <span
            style={{
              border: `1px solid ${
                moment(params.row.date).isAfter(new Date()) ? 'green' : 'red'
              }`,
              width: '70px',
              textAlign: 'center',
              borderRadius: '10px',
              padding: '1px',
            }}
          >
            {moment(params.row.date).isAfter(new Date()) ? (
              <>
                <FontAwesomeIcon
                  icon={faLockOpen}
                  style={{ color: '#3bb077' }}
                />{' '}
                Open
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faLock} style={{ color: 'red' }} />{' '}
                Closed
              </>
            )}
          </span>
        );
      },
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
      field: 'action',
      headerName: 'Actions',
      width: 210,
      renderCell: (params) => {
        return (
          <>
            <Link to={'/competition/' + params.row._id}>
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
        <RolesContainer>
          <CreateRoleContainer>
            <CreateRoleContainerTitle>Competitions</CreateRoleContainerTitle>
            <Link to='/create/competition'>
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
          <DeleteContainer>
            {selectedRows.length ? (
              <ButtonDelete onClick={handleDelete}>
                REMOVE ({selectedRows.length}) SELECTED
                {isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
              </ButtonDelete>
            ) : null}
          </DeleteContainer>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              setSelectedRows(ids);
            }}
          />
        </RolesContainer>
      </Container>
    </>
  );
};

export default Competitions;
