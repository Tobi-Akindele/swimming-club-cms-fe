import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import SearchInput from '../../components/formComponents/SearchInput';
import AddParticipantModal from '../../components/modal/AddParticipantModal';
import EventResultModal from '../../components/modal/EventResultModal';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import {
  deleteEventParticipantFailure,
  deleteEventParticipantStart,
  deleteEventParticipantSuccess,
} from '../../redux/competitionRedux';
import { calculateAge, setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const EventContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
`;

const EventTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const EventTitle = styled.h1``;

const EventDetailContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const EventDetailTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const EventDetailInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;

const EventDetailText = styled.span`
  margin-left: 10px;
`;

const AddParticipantContainer = styled.div`
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

const ParticipantsContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const ParticipantTitle = styled.h2``;

const Pariticipants = styled.div``;

const ParticipantTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
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

const Event = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const competitionId = location.pathname.split('/')[2];
  const eventId = location.pathname.split('/')[4];
  const competition = useSelector((state) =>
    state.competition.competitions.find(
      (competition) => competition._id === competitionId
    )
  );
  const event = competition?.events.find((event) => event._id === eventId);
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showRecordResultModal, setShowRecordResultModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [results, setResults] = useState([]);
  const [isFetchingParticipants, setIsFetchingParticipants] = useState(false);
  const { isFetching: isDeleting } = useSelector((state) => state.competition);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetchingParticipants(true);
    openRequest
      .get(`/event/${eventId}`, setAuthToken(currentUser.accessToken))
      .then((result) => {
        setIsFetchingParticipants(false);
        setParticipants(result.data?.participants);
        setResults(result.data?.results);
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        setIsFetchingParticipants(false);
      });
  }, [currentUser, eventId]);

  const keys = ['firstName', 'lastName', 'gender', 'username'];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const rows = participants?.length
    ? Object.entries(search(participants)).map(([k, v]) => {
        return {
          ...v,
          id: participants[k]._id,
        };
      })
    : [];

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
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
    {
      field: 'username',
      headerName: 'Username',
      width: 200,
    },
    {
      field: 'club',
      headerName: 'Club',
      width: 200,
      renderCell: (params) => {
        return (
          <span>
            {params.row.club?.name?.length ? params.row.club?.name : 'nil'}
          </span>
        );
      },
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 200,
      renderCell: (params) => {
        return (
          <span>
            {calculateAge(params.row.dateOfBirth)}
            {' years'}
          </span>
        );
      },
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 200,
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 200,
    },
    {
      field: 'finalPoint',
      headerName: 'Final Point',
      width: 200,
    },
  ];

  const openAddParticipantModal = (e) => {
    e.preventDefault();
    setShowAddParticipantModal((prev) => !prev);
  };

  const openRecordResultModal = (e) => {
    e.preventDefault();
    setShowRecordResultModal((prev) => !prev);
  };

  const handleDeleteEvent = (e) => {
    e.preventDefault();
    const payload = {
      eventId: eventId,
      participantIds: selectedRows,
    };
    dispatch(deleteEventParticipantStart());
    openRequest
      .post(
        '/remove/participants',
        payload,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        const updateEvent = {
          ...result.data,
          competitionId: competitionId,
          eventId: eventId,
        };
        dispatch(deleteEventParticipantSuccess(updateEvent));
        toast.success('Event(s) deleted successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        dispatch(deleteEventParticipantFailure());
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
        <EventContainer>
          <EventTitleContainer>
            <EventTitle>Event</EventTitle>
            <ButtonDelete onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faAngleLeft} /> Back
            </ButtonDelete>
          </EventTitleContainer>
          <EventDetailContainer>
            <EventDetailTitle>Event Details</EventDetailTitle>
            <EventDetailInfo>
              Name:
              <EventDetailText>{event.name}</EventDetailText>
            </EventDetailInfo>
            <EventDetailInfo>
              Created:
              <EventDetailText>{format(event._created)}</EventDetailText>
            </EventDetailInfo>
            <EventDetailInfo>
              Registered Participants:
              <EventDetailText>
                {participants ? participants?.length : 0}
              </EventDetailText>
            </EventDetailInfo>
          </EventDetailContainer>

          <AddParticipantContainer>
            {selectedRows.length && !results?.length ? (
              <ButtonDelete onClick={handleDeleteEvent}>
                REMOVE ({selectedRows.length}) SELECTED
                {isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
              </ButtonDelete>
            ) : null}
            {moment(competition.date).isAfter(new Date()) ? (
              <ButtonCreate onClick={openAddParticipantModal}>
                {currentUser.admin ? 'ADD PARTICIPANT' : 'PARTICIPATE'}
              </ButtonCreate>
            ) : (
              <ButtonCreate disabled>
                {currentUser.admin ? 'ADD PARTICIPANT' : 'PARTICIPATE'}
              </ButtonCreate>
            )}
            {!results?.length && (
              <ButtonCreate onClick={openRecordResultModal}>
                RECORD RESULTS
              </ButtonCreate>
            )}
          </AddParticipantContainer>

          <ParticipantsContainer>
            <ParticipantTopContainer>
              <ParticipantTitle>Participants</ParticipantTitle>
              <SearchInput
                type='text'
                placeholder='Search'
                onChange={(e) => setQuery(e.target.value)}
                width='300px'
              />
            </ParticipantTopContainer>
            <Pariticipants>
              {isFetchingParticipants ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ fontSize: '50px' }}
                />
              ) : (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: '_created', sort: 'desc' }],
                    },
                  }}
                  autoHeight
                  pageSize={5}
                  checkboxSelection={!results?.length}
                  rowsPerPageOptions={[5, 10]}
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                />
              )}
            </Pariticipants>
          </ParticipantsContainer>
        </EventContainer>
        <AddParticipantModal
          showModal={showAddParticipantModal}
          setShowModal={setShowAddParticipantModal}
          eventId={eventId}
          competitionId={competitionId}
        />
        <EventResultModal
          showModal={showRecordResultModal}
          setShowModal={setShowRecordResultModal}
          participants={participants}
          event={event}
        />
      </Container>
    </>
  );
};

export default Event;
