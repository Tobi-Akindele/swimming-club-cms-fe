import { faEye } from '@fortawesome/free-solid-svg-icons';
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
  getAllClubsFailure,
  getAllClubssSuccess,
  getAllClubsStart,
} from '../../redux/clubRedux';
import { setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const ClubsContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
`;

const CreateClubContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const CreateClubContainerTitle = styled.h1``;

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

const Clubs = () => {
  const dispatch = useDispatch();
  const clubs = useSelector((state) => state.club?.clubs);
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(getAllClubsStart());
    openRequest
      .get('/clubs', setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(getAllClubssSuccess(result.data));
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        dispatch(getAllClubsFailure());
      });
  }, [dispatch, currentUser]);

  const search = (data) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const rows =
    clubs &&
    Object.entries(search(clubs)).map(([k, v]) => {
      return {
        ...v,
        id: clubs[k]._id,
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
      field: 'coach',
      headerName: 'Coach',
      width: 210,
      renderCell: (params) => {
        return (
          <span>
            {params.row.coach?.firstName}{' '}
            {params.row.coach?.lastName?.toUpperCase()}
          </span>
        );
      },
    },
    {
      field: 'clubSize',
      headerName: 'Club Size',
      width: 210,
      renderCell: (params) => {
        return (
          <span>
            {params.row.members?.length ? params.row.members?.length : 0}
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
            <Link to={'/club/' + params.row._id}>
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
        <ClubsContainer>
          <CreateClubContainer>
            <CreateClubContainerTitle>Clubs</CreateClubContainerTitle>
            <Link to='/create/club'>
              <ButtonCreate>Create</ButtonCreate>
            </Link>
          </CreateClubContainer>
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
        </ClubsContainer>
      </Container>
    </>
  );
};

export default Clubs;
