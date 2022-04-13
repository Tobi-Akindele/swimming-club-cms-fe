import {
  faAngleLeft,
  faSpinner,
  faPenToSquare,
  faBars,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import SearchInput from '../../components/formComponents/SearchInput';
import AddClubMemberModal from '../../components/modal/AddClubMemberModal';
import AddTrainingDataModal from '../../components/modal/AddTrainingDataModal';
import UpdateClubModal from '../../components/modal/UpdateClub';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import { calculateAge, setAuthToken } from '../../utils';
import './club.css';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const ClubContainer = styled.div`
  flex: 4;
  padding: 0px 20px;
`;

const ClubTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ClubTitle = styled.h1``;

const ClubDetailContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const ClubDetailTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ClubDetailTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const ClubDetailInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;

const ClubDetailText = styled.span`
  margin-left: 10px;
`;

const ShowCoachInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0px;
`;

const ShowCoachImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const ShowCoachTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const ShowCoachUsername = styled.span`
  font-weight: 600;
`;

const ShowCoachUserType = styled.span`
  font-weight: 300;
`;

const AddMemberContainer = styled.div`
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

const DataGridContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  margin: 15px 0px;
`;

const MemberTitle = styled.h2``;

const Data = styled.div``;

const DataGridTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
`;

const MemberCellContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MemberCellImg = styled.img`
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

const Club = () => {
  const location = useLocation();
  const clubId = location.pathname.split('/')[2];
  const club = useSelector((state) =>
    state.club?.clubs?.find((club) => club._id === clubId)
  );
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddTrainingDataModal, setShowAddTrainingDataModal] =
    useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [coach, setCoach] = useState([]);
  const [coachUserType, setCoachUserType] = useState({});
  const [isFetchingClub, setIsFetchingClub] = useState(false);
  const { isFetching: isDeleting } = useSelector((state) => state.club);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetchingClub(true);
    openRequest
      .get(`/club/${clubId}`, setAuthToken(currentUser.accessToken))
      .then((result) => {
        setIsFetchingClub(false);
        setMembers(result.data?.members);
        setCoach(result.data?.coach);
        setTrainingData(result.data?.trainingData);
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        setIsFetchingClub(false);
      });
  }, [currentUser, clubId]);

  useEffect(() => {
    if (coach && coach.userType && coach.userType._id) {
      openRequest
        .get(
          `/user-type/${coach.userType._id}`,
          setAuthToken(currentUser.accessToken)
        )
        .then((result) => {
          setCoachUserType(result.data);
        })
        .catch((err) => {});
    }
  }, [currentUser, coach]);

  const keys = ['firstName', 'lastName', 'gender', 'username'];
  const searchWithKeys = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const search = (data) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const memberData = members?.length
    ? Object.entries(searchWithKeys(members)).map(([k, v]) => {
        return {
          ...v,
          id: members[k]._id,
        };
      })
    : [];

  const memberColumns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 250,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 250,
      renderCell: (params) => {
        return (
          <MemberCellContainer>
            <MemberCellImg
              src={
                params.row.image ||
                'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
              }
              alt='user image'
            />
            {params.row.firstName} {params.row.lastName.toUpperCase()}
          </MemberCellContainer>
        );
      },
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 250,
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 250,
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
      width: 250,
    },
  ];

  const trainings = trainingData?.length
    ? Object.entries(search(trainingData)).map(([k, v]) => {
        return {
          ...v,
          id: trainingData[k]._id,
        };
      })
    : [];

  const trainingsColumns = [
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
      field: 'participants',
      headerName: 'No of Participants',
      width: 250,
      renderCell: (params) => {
        return (
          <span>
            {params.row?.participants?.length
              ? params.row?.participants?.length
              : 0}
          </span>
        );
      },
    },
    {
      field: '_created',
      headerName: 'Created',
      width: 250,
      renderCell: (params) => {
        return <span>{format(params.row._created)}</span>;
      },
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/club/${clubId}/training-data/${params.row._id}`}>
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

  const openAddMemberModal = (e) => {
    e.preventDefault();
    setShowAddMemberModal((prev) => !prev);
  };

  const openUpdateModal = (e) => {
    e.preventDefault();
    setShowUpdateModal((prev) => !prev);
  };

  const openAddTrainingDataModal = (e) => {
    e.preventDefault();
    setShowAddTrainingDataModal((prev) => !prev);
  };

  const handleDeleteMember = (e) => {
    e.preventDefault();
    const payload = {
      clubId: clubId,
      memberIds: selectedMembers,
    };
    openRequest
      .post(
        '/club/remove/members',
        payload,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        toast.success('Members(s) removed successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
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
        <ClubContainer>
          <ClubTitleContainer>
            <ClubTitle>Club</ClubTitle>
            <ButtonDelete onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faAngleLeft} /> Back
            </ButtonDelete>
          </ClubTitleContainer>
          <ClubDetailContainer>
            <ClubDetailTitleContainer>
              <ClubDetailTitle>Club Details</ClubDetailTitle>
              <FontAwesomeIcon
                icon={faPenToSquare}
                title='Edit Club'
                fontSize='25px'
                cursor='pointer'
                onClick={openUpdateModal}
              />
            </ClubDetailTitleContainer>
            <ClubDetailInfo>
              Name:
              <ClubDetailText>{club?.name}</ClubDetailText>
            </ClubDetailInfo>
            <ClubDetailInfo>
              Created:
              <ClubDetailText>{format(club?._created)}</ClubDetailText>
            </ClubDetailInfo>
            <ClubDetailInfo>
              Club Size:
              <ClubDetailText>{members ? members?.length : 0}</ClubDetailText>
            </ClubDetailInfo>

            <ShowCoachInfo>
              <ShowCoachImage src={coach?.image} alt='coach picture' />
              <ShowCoachTitle>
                <ShowCoachUsername>
                  {coach?.firstName} {coach?.lastName?.toUpperCase()}{' '}
                  {coach.middleName}
                </ShowCoachUsername>
                <ShowCoachUserType>
                  {coachUserType?.name?.toUpperCase()}
                </ShowCoachUserType>
              </ShowCoachTitle>
            </ShowCoachInfo>
          </ClubDetailContainer>

          <AddMemberContainer>
            {selectedMembers.length ? (
              <ButtonDelete onClick={handleDeleteMember}>
                REMOVE ({selectedMembers.length}) SELECTED
                {isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
              </ButtonDelete>
            ) : null}

            <div class='dropdown' style={{ float: 'right' }}>
              <FontAwesomeIcon
                icon={faBars}
                fontSize='40px'
                cursor={'pointer'}
                className={'dropbtn'}
              />
              <div class='dropdown-content'>
                <button onClick={openAddMemberModal}>Add Member</button>
                <button onClick={openAddTrainingDataModal}>
                  Add Training Data
                </button>
              </div>
            </div>
          </AddMemberContainer>

          <DataGridContainer>
            <DataGridTopContainer>
              <MemberTitle>Members</MemberTitle>
              <SearchInput
                type='text'
                placeholder='Search'
                onChange={(e) => setQuery(e.target.value)}
                width='300px'
              />
            </DataGridTopContainer>
            <Data>
              {isFetchingClub ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ fontSize: '50px' }}
                />
              ) : (
                <DataGrid
                  rows={memberData}
                  columns={memberColumns}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: '_created', sort: 'desc' }],
                    },
                  }}
                  autoHeight
                  checkboxSelection
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  onSelectionModelChange={(ids) => {
                    setSelectedMembers(ids);
                  }}
                />
              )}
            </Data>
          </DataGridContainer>

          <DataGridContainer>
            <DataGridTopContainer>
              <MemberTitle>Training Data</MemberTitle>
              <SearchInput
                type='text'
                placeholder='Search'
                onChange={(e) => setQuery(e.target.value)}
                width='300px'
              />
            </DataGridTopContainer>
            <Data>
              {isFetchingClub ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ fontSize: '50px' }}
                />
              ) : (
                <DataGrid
                  rows={trainings}
                  columns={trainingsColumns}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: '_created', sort: 'desc' }],
                    },
                  }}
                  autoHeight
                  checkboxSelection
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  onSelectionModelChange={(ids) => {
                    setSelectedMembers(ids);
                  }}
                />
              )}
            </Data>
          </DataGridContainer>
        </ClubContainer>

        {/* Modals */}
        <AddClubMemberModal
          showModal={showAddMemberModal}
          setShowModal={setShowAddMemberModal}
          clubId={clubId}
        />
        <UpdateClubModal
          showModal={showUpdateModal}
          setShowModal={setShowUpdateModal}
          club={club}
          coach={coach}
        />
        <AddTrainingDataModal
          showModal={showAddTrainingDataModal}
          setShowModal={setShowAddTrainingDataModal}
          clubId={clubId}
        />
      </Container>
    </>
  );
};

export default Club;
