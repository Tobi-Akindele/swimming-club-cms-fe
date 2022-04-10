import {
  faEye,
  faLock,
  faLockOpen,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import SearchInput from '../../components/formComponents/SearchInput';
import AddEventModal from '../../components/modal/AddEventModal';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import {
  deleteEventsFailure,
  deleteEventsStart,
  deleteEventsSuccess,
} from '../../redux/competitionRedux';
import { setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const CompetitionContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
`;

const CompetitionTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CompetitionTitle = styled.h1``;

const CompetitionDetailContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const CompetitionDetailTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const CompetitionDetailInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;

const CompetitionDetailText = styled.span`
  margin-left: 10px;
`;

const AddEventContainer = styled.div`
  display: flex;
  margin: 15px 0px;
  justify-content: flex-end;
`;

const ButtonCreate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  margin: 0px 10px;
  cursor: pointer;
  color: white;
  font-size: 15px;
  &:disabled {
    cursor: not-allowed;
  }
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

const EventContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const EventTitle = styled.h2``;

const Events = styled.div``;

const EventTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
`;

const ButtonEdit = styled.button`
  border: 1px solid #3bb077;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: white;
  margin: auto;
`;

const Competition = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const competitionId = location.pathname.split('/')[2];
  const competition = useSelector((state) =>
    state.competition.competitions.find(
      (competition) => competition._id === competitionId
    )
  );
  const { isFetching: isDeleting } = useSelector((state) => state.competition);
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const search = (data) => {
    if (data) {
      return data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    return data;
  };

  const events =
    competition && competition.events?.length
      ? Object.entries(search(competition.events)).map(([k, v]) => {
          return {
            ...v,
            id: competition.events[k]._id,
          };
        })
      : [];

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 250,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
    },
    {
      field: 'registeredParticipants',
      headerName: 'Registered Participants',
      width: 250,
      renderCell: (params) => {
        return (
          <span>
            {params.row.participants ? params.row.participants?.length : 0}
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
            <Link to={`/competition/${competitionId}/event/${params.row._id}`}>
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

  const openModal = (e) => {
    e.preventDefault();
    setShowModal((prev) => !prev);
  };

  const handleDeleteEvent = (e) => {
    e.preventDefault();
    const payload = {
      competitionId: competitionId,
      eventIds: selectedRows,
    };
    dispatch(deleteEventsStart());
    openRequest
      .post('/remove/events', payload, setAuthToken(currentUser.accessToken))
      .then((result) => {
        dispatch(deleteEventsSuccess(payload));
        toast.success('Event(s) deleted successfully');
      })
      .catch((err) => {
        dispatch(deleteEventsFailure());
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
      });
  };

  return (
    <>
      <Topbar wMessage={false} />
      <Container>
        <Sidebar />
        <CompetitionContainer>
          <CompetitionTitleContainer>
            <CompetitionTitle>Competition</CompetitionTitle>
          </CompetitionTitleContainer>
          <CompetitionDetailContainer>
            <CompetitionDetailTitle>Competition Details</CompetitionDetailTitle>
            <CompetitionDetailInfo>
              Name:
              <CompetitionDetailText>{competition.name}</CompetitionDetailText>
            </CompetitionDetailInfo>
            <CompetitionDetailInfo>
              Date:
              <CompetitionDetailText>
                {moment(competition.date).format('MMM Do YYYY')} (
                <span style={{ fontWeight: '1000' }}>
                  {format(competition.date)})
                </span>
              </CompetitionDetailText>
            </CompetitionDetailInfo>
            <CompetitionDetailInfo>
              Created:
              <CompetitionDetailText>
                {format(competition._created)}
              </CompetitionDetailText>
            </CompetitionDetailInfo>
            <CompetitionDetailInfo>
              Status:
              <CompetitionDetailText>
                <span
                  style={{
                    border: `1px solid ${
                      moment(competition.date).isAfter(new Date())
                        ? 'green'
                        : 'red'
                    }`,
                    width: '70px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {moment(competition.date).isAfter(new Date()) ? (
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
              </CompetitionDetailText>
            </CompetitionDetailInfo>
          </CompetitionDetailContainer>

          <AddEventContainer>
            {selectedRows.length ? (
              <ButtonDelete onClick={handleDeleteEvent}>
                REMOVE ({selectedRows.length}) SELECTED
                {isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
              </ButtonDelete>
            ) : null}
            {moment(competition.date).isAfter(new Date()) ? (
              <ButtonCreate onClick={openModal}>ADD EVENT</ButtonCreate>
            ) : (
              <ButtonCreate disabled>ADD EVENT</ButtonCreate>
            )}
          </AddEventContainer>

          <EventContainer>
            <EventTopContainer>
              <EventTitle>Events</EventTitle>
              <SearchInput
                type='text'
                placeholder='Search'
                onChange={(e) => setQuery(e.target.value)}
                width='300px'
              />
            </EventTopContainer>
            <Events>
              <DataGrid
                rows={events}
                columns={columns}
                initialState={{
                  sorting: {
                    sortModel: [{ field: '_created', sort: 'desc' }],
                  },
                }}
                autoHeight
                pageSize={10}
                rowHeight={40}
                checkboxSelection
                rowsPerPageOptions={[10]}
                onSelectionModelChange={(ids) => {
                  setSelectedRows(ids);
                }}
              />
            </Events>
          </EventContainer>
        </CompetitionContainer>
        <AddEventModal
          showModal={showModal}
          setShowModal={setShowModal}
          events={events}
          competitionId={competitionId}
        />
      </Container>
    </>
  );
};

export default Competition;
