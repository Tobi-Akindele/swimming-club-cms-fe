import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import SearchInput from '../../components/formComponents/SearchInput';
import AddTDPModal from '../../components/modal/AddTDPModal';
import ResultModal from '../../components/modal/EventResultModal';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import { calculateAge, setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const TDContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
`;

const TDTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TDTitle = styled.h1``;

const ButtonBack = styled.button`
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

const TDDetailContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const TDDetailTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const TDDetailInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;

const TDDetailText = styled.span`
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

const ParticipantsContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const ParticipantTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
`;

const ParticipantTitle = styled.h2``;

const Pariticipants = styled.div``;

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

const TrainingData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clubId = location.pathname.split('/')[2];
  const trainingDataId = location.pathname.split('/')[4];
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [trainingData, setTrainingData] = useState({});
  const [isFetchingTD, setIsFetchingTD] = useState(false);
  const [query, setQuery] = useState('');
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showRecordResultModal, setShowRecordResultModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsFetchingTD(true);
    openRequest
      .get(
        `/training-data/${trainingDataId}`,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        setIsFetchingTD(false);
        setTrainingData(result.data);
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        setIsFetchingTD(false);
      });
  }, [currentUser, trainingDataId]);

  const keys = ['firstName', 'lastName', 'gender', 'username'];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const rows = trainingData?.participants?.length
    ? Object.entries(search(trainingData?.participants)).map(([k, v]) => {
        return {
          ...v,
          id: trainingData?.participants[k]._id,
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

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      trainingDataId: trainingData._id,
      ...values,
    };
    setIsSubmitting(true);
    openRequest
      .post(
        '/training-data/results',
        payload,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        setIsSubmitting(false);
        resetForm({});
        toast.success('Results recorded successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setIsSubmitting(false);
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
        <TDContainer>
          <TDTitleContainer>
            <TDTitle>Training Data</TDTitle>
            <ButtonBack onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faAngleLeft} /> Back
            </ButtonBack>
          </TDTitleContainer>

          <TDDetailContainer>
            <TDDetailTitle>Training Data Details</TDDetailTitle>

            <TDDetailInfo>
              Name: <TDDetailText>{trainingData?.name}</TDDetailText>
            </TDDetailInfo>
            <TDDetailInfo>
              Created:{' '}
              <TDDetailText>{format(trainingData?._created)}</TDDetailText>
            </TDDetailInfo>
            <TDDetailInfo>
              No of Participants:{' '}
              <TDDetailText>
                {trainingData?.participants?.length
                  ? trainingData?.participants?.length
                  : 0}
              </TDDetailText>
            </TDDetailInfo>
          </TDDetailContainer>

          <AddParticipantContainer>
            {!trainingData?.results?.length ? (
              <ButtonCreate onClick={openAddParticipantModal}>
                ADD PARTICIPANT
              </ButtonCreate>
            ) : (
              <ButtonCreate disabled>ADD PARTICIPANT</ButtonCreate>
            )}

            <ButtonCreate
              onClick={openRecordResultModal}
              disabled={!trainingData?.participants?.length}
            >
              RECORD RESULTS
            </ButtonCreate>
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
              {isFetchingTD ? (
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
                      sortModel: [{ field: 'finalPoint', sort: 'desc' }],
                    },
                  }}
                  autoHeight
                  pageSize={5}
                  checkboxSelection={!trainingData?.results?.length}
                  rowsPerPageOptions={[5, 10]}
                />
              )}
            </Pariticipants>
          </ParticipantsContainer>
        </TDContainer>
        <AddTDPModal
          showModal={showAddParticipantModal}
          setShowModal={setShowAddParticipantModal}
          existingParticipants={trainingData?.participants}
          trainingDataId={trainingDataId}
          clubId={clubId}
        />
        <ResultModal
          showModal={showRecordResultModal}
          setShowModal={setShowRecordResultModal}
          participants={trainingData?.participants}
          resultName={trainingData?.name}
          onSubmit={onSubmit}
          submitting={isSubmitting}
          setSubmitting={setIsSubmitting}
        />
      </Container>
    </>
  );
};

export default TrainingData;
