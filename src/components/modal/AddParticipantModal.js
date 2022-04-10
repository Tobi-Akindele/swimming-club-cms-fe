import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { openRequest } from '../../apiRequests';
import * as Yup from 'yup';
import { setAuthToken } from '../../utils';
import {
  addEventParticipantFailure,
  addEventParticipantStart,
  addEventParticipantSuccess,
} from '../../redux/competitionRedux';
import DataListInput from '../formComponents/DataListInput';

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
  width: 35%;
  height: 30%;
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
  margin: 10px auto;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`;

const ButtonUpdate = styled.button`
  border: none;
  padding: 10px;
  background-color: #79a5d9;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`;

const AddParticipantModal = ({
  showModal,
  setShowModal,
  competitionId,
  eventId,
}) => {
  const modalRef = useRef();
  const currentUser = useSelector((state) => state.login?.currentUser);
  const { isFetching: isCreating } = useSelector((state) => state.competition);
  const dispatch = useDispatch();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const validate = Yup.object({
    userId: Yup.string().required('Username is required'),
  });

  const loadOptions = async (inputText, callback) => {
    let config = {
      headers: {
        username: inputText,
        userType: 'swimmer',
      },
    };
    try {
      const response = await openRequest.get('/users/search/type', config);
      const json = await response.data;

      callback(
        json.map((item) => ({
          label: `${item.username} (${item.firstName} ${item.lastName})`,
          value: item._id,
        }))
      );
    } catch (error) {}
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
              <ModalContentTopTitle>Event Registration</ModalContentTopTitle>
            </ModalContentTop>

            <ModalContentBottom>
              <Formik
                initialValues={{ userId: '' }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  const payload = {
                    eventId: eventId,
                    participantId: values.userId,
                  };
                  dispatch(addEventParticipantStart());
                  openRequest
                    .post(
                      '/event/register',
                      payload,
                      setAuthToken(currentUser.accessToken)
                    )
                    .then((result) => {
                      resetForm({});
                      const newEvent = {
                        ...result.data,
                        competitionId: competitionId,
                      };
                      dispatch(addEventParticipantSuccess(newEvent));
                      toast.success('Registration successful');
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    })
                    .catch((err) => {
                      let message = err.response?.data?.message
                        ? err.response?.data?.message
                        : err.message;
                      toast.error(message);
                      dispatch(addEventParticipantFailure());
                    });
                }}
              >
                {(formik) => (
                  <Form>
                    <DataListInput
                      value={formik.values.userId}
                      name='userId'
                      type='text'
                      placeholder='Search Swimmers'
                      label='Participant'
                      onChange={formik.setFieldValue}
                      onBlur={formik.setFieldTouched}
                      loadOptions={loadOptions}
                      error={formik.errors.userId}
                      touched={formik.touched.userId}
                      width='350px'
                    />
                    <ButtonContainer>
                      <ButtonUpdate
                        type='submit'
                        disabled={
                          !formik.dirty || !formik.isValid || isCreating
                        }
                      >
                        REGISTER{' '}
                        {isCreating && (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        )}
                      </ButtonUpdate>
                    </ButtonContainer>
                  </Form>
                )}
              </Formik>
            </ModalContentBottom>
            <FontAwesomeIcon
              icon={faXmark}
              style={closeModalIcon}
              aria-label='Close modal'
              onClick={() => setShowModal((prev) => !prev)}
            />
          </ModalWrapper>
        </Background>
      ) : null}
    </>
  );
};

export default AddParticipantModal;
