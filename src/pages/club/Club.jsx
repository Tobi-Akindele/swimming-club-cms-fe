import { faAngleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import SearchInput from '../../components/formComponents/SearchInput';
import AddClubMemberModal from '../../components/modal/AddClubMemberModal';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import { calculateAge, setAuthToken } from '../../utils';

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

const MembersContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const MemberTitle = styled.h2``;

const Members = styled.div``;

const MemberTopContainer = styled.div`
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

const Club = () => {
  const location = useLocation();
  const clubId = location.pathname.split('/')[2];
  const club = useSelector((state) =>
    state.club.clubs.find((club) => club._id === clubId)
  );
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [members, setMembers] = useState([]);
  const [coach, setCoach] = useState([]);
  const [coachUserType, setCoachUserType] = useState({});
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const { isFetching: isDeleting } = useSelector((state) => state.club);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetchingMembers(true);
    openRequest
      .get(`/club/${clubId}`, setAuthToken(currentUser.accessToken))
      .then((result) => {
        setIsFetchingMembers(false);
        setMembers(result.data?.members);
        setCoach(result.data?.coach);
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        setIsFetchingMembers(false);
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
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const rows = members?.length
    ? Object.entries(search(members)).map(([k, v]) => {
        return {
          ...v,
          id: members[k]._id,
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
  ];

  const openAddParticipantModal = (e) => {
    e.preventDefault();
    setShowAddMemberModal((prev) => !prev);
  };

  const handleDeleteEvent = (e) => {
    e.preventDefault();
    const payload = {
      eventId: clubId,
      members: selectedRows,
    };
    openRequest
      .post('/remove/members', payload, setAuthToken(currentUser.accessToken))
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
            <ClubDetailTitle>Club Details</ClubDetailTitle>
            <ClubDetailInfo>
              Name:
              <ClubDetailText>{club.name}</ClubDetailText>
            </ClubDetailInfo>
            <ClubDetailInfo>
              Created:
              <ClubDetailText>{format(club._created)}</ClubDetailText>
            </ClubDetailInfo>
            <ClubDetailInfo>
              Club Size:
              <ClubDetailText>{members ? members?.length : 0}</ClubDetailText>
            </ClubDetailInfo>

            <ShowCoachInfo>
              <ShowCoachImage
                src={
                  coach?.image ||
                  'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
                }
                alt='coach picture'
              />
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
            {selectedRows.length ? (
              <ButtonDelete onClick={handleDeleteEvent}>
                REMOVE ({selectedRows.length}) SELECTED
                {isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
              </ButtonDelete>
            ) : null}

            <ButtonCreate onClick={openAddParticipantModal}>
              ADD MEMBER
            </ButtonCreate>
          </AddMemberContainer>

          <MembersContainer>
            <MemberTopContainer>
              <MemberTitle>Members</MemberTitle>
              <SearchInput
                type='text'
                placeholder='Search'
                onChange={(e) => setQuery(e.target.value)}
                width='300px'
              />
            </MemberTopContainer>
            <Members>
              {isFetchingMembers ? (
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
                  rowsPerPageOptions={[5, 10]}
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                />
              )}
            </Members>
          </MembersContainer>
        </ClubContainer>
        <AddClubMemberModal
          showModal={showAddMemberModal}
          setShowModal={setShowAddMemberModal}
          clubId={clubId}
        />
      </Container>
    </>
  );
};

export default Club;
