import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { openRequest } from '../../apiRequests';
import { calculateAge, filterArray, setAuthToken } from '../../utils';
import SearchInput from '../formComponents/SearchInput';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 65%;
  height: 80%;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: flex;
  position: relative;
  z-index: 10;
  border-radius: 10px;
  flex-direction: column;
`;

const ModalContentTop = styled.div`
  margin: 10px;
`;

const ModalContentTopTitle = styled.h2``;

const ModalContentBottom = styled.div`
  margin: 10px;
  justify-content: center;
  align-items: center;
`;

const closeModalIcon = {
  cursor: 'pointer',
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '32px',
  height: '32px',
  padding: '0',
  zIndex: '10',
};

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 10px;
`;

const SubmitContainer = styled.div`
  display: flex;
  margin: 15px 10px;
  justify-content: center;
`;

const ButtonCreate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  cursor: pointer;
  color: white;
  font-size: 15px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const AddTDPModal = ({
  showModal,
  setShowModal,
  existingParticipants,
  trainingDataId,
  clubId,
}) => {
  const modalRef = useRef();
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  const [clubMembers, setClubMembers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isFetchingCM, setIsFetchingCM] = useState(false);

  useEffect(() => {
    setIsFetchingCM(true);
    openRequest
      .get(`/club/${clubId}/members`, setAuthToken(currentUser.accessToken))
      .then((result) => {
        setIsFetchingCM(false);
        setClubMembers(result.data);
      })
      .catch((err) => {
        setIsFetchingCM(false);
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
      });
  }, [clubId, currentUser]);

  let filteredParticipants = filterArray(clubMembers, existingParticipants);

  const keys = ['firstName', 'lastName', 'gender', 'username'];
  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase()))
    );
  };

  const rows =
    filteredParticipants &&
    Object.entries(search(filteredParticipants)).map(([k, v]) => {
      return {
        ...v,
        id: filteredParticipants[k]._id,
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
      renderCell: (params) => {
        return (
          <>
            {params.row.firstName} {params.row.lastName.toUpperCase()}
          </>
        );
      },
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 210,
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 210,
      renderCell: (params) => {
        return <>{calculateAge(params.row.dateOfBirth)}</>;
      },
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 210,
    },
  ];

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setQuery('');
      setShowModal(false);
    }
  };

  const handleClick = () => {
    setSubmitting(true);
    const addParticipants = {
      trainingDataId: trainingDataId,
      participantIds: selectedRows,
    };
    openRequest
      .post(
        '/training-data/add/participants',
        addParticipants,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        setSubmitting(false);
        toast.success('Participants added successfully');
        setQuery('');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        setSubmitting(false);
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
      });
  };

  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <ModalWrapper showModal={showModal}>
            <ModalContentTop>
              <ModalContentTopTitle>
                Available Participants
              </ModalContentTopTitle>
            </ModalContentTop>
            <SearchContainer>
              <SearchInput
                type='text'
                placeholder='Search'
                onChange={(e) => setQuery(e.target.value)}
                width='300px'
              />
            </SearchContainer>
            <ModalContentBottom>
              {isFetchingCM ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ fontSize: '50px' }}
                />
              ) : (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  autoHeight
                  checkboxSelection={true}
                  pageSize={10}
                  rowHeight={40}
                  rowsPerPageOptions={[10]}
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                />
              )}
            </ModalContentBottom>
            <FontAwesomeIcon
              icon={faXmark}
              style={closeModalIcon}
              aria-label='Close modal'
              onClick={() => setShowModal((prev) => !prev)}
            />
            <SubmitContainer>
              <ButtonCreate
                onClick={handleClick}
                disabled={!selectedRows.length || submitting}
              >
                SUBMIT
                {submitting && <FontAwesomeIcon icon={faSpinner} spin />}
              </ButtonCreate>
            </SubmitContainer>
          </ModalWrapper>
        </Background>
      ) : null}
    </>
  );
};

export default AddTDPModal;
