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
import TextField from '../formComponents/TextField';
import {
  createEventFailure,
  createEventStart,
  createEventSuccess,
} from '../../redux/competitionRedux';

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
  justify-content: flex-end;
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

const AddEventModal = ({ showModal, setShowModal, competitionId }) => {
  const modalRef = useRef();
  const currentUser = useSelector((state) => state.login?.currentUser);
  const { isFetching: isCreating } = useSelector((state) => state.competition);
  const dispatch = useDispatch();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  function isUniqueName(eMessage) {
    return this.test('isUniqueName', async function (value) {
      const { path, createError } = this;
      if (!value || value?.length < 2) {
        return true;
      }
      let config = {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
          name: value,
          competitionId: competitionId,
        },
      };

      try {
        await openRequest.get('/event/name', config);
        return createError({ path, message: eMessage });
      } catch (error) {
        return true;
      }
    });
  }

  Yup.addMethod(Yup.mixed, 'isUniqueName', isUniqueName);

  const validate = Yup.object({
    name: Yup.string()
      .min(3, 'Too short')
      .isUniqueName('Event exists')
      .required('Event name is required'),
  });

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
              <ModalContentTopTitle>Create Event</ModalContentTopTitle>
            </ModalContentTop>

            <ModalContentBottom>
              <Formik
                initialValues={{ name: '' }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  const payload = {
                    ...values,
                    competitionId: competitionId,
                  };
                  dispatch(createEventStart());
                  openRequest
                    .post(
                      '/event',
                      payload,
                      setAuthToken(currentUser.accessToken)
                    )
                    .then((result) => {
                      resetForm({});
                      const newEvent = {
                        ...result.data,
                        competitionId: competitionId,
                      };
                      dispatch(createEventSuccess(newEvent));
                      toast.success('Competition created successfully');
                    })
                    .catch((err) => {
                      let message = err.response?.data?.message
                        ? err.response?.data?.message
                        : err.message;
                      toast.error(message);
                      dispatch(createEventFailure());
                    });
                }}
              >
                {(formik) => (
                  <Form>
                    <TextField
                      name='name'
                      type='text'
                      placeholder='New Event'
                      label='Name'
                    />
                    <ButtonContainer>
                      <ButtonUpdate
                        type='submit'
                        disabled={
                          !formik.dirty || !formik.isValid || isCreating
                        }
                      >
                        SUBMIT{' '}
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

export default AddEventModal;
