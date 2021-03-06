import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray, Form, Formik } from 'formik';
import React, { useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import * as Yup from 'yup';
import TextField from '../formComponents/TextField';

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
  width: 40%;
  height: 80%;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: flex;
  position: relative;
  z-index: 10;
  border-radius: 10px;
  flex-direction: column;
  overflow-y: scroll;
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

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const ResultContainerLeft = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
`;

const ResultContainerDetailTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const ResultContainerRight = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px 10px;
`;

const ResultModal = ({
  showModal,
  setShowModal,
  participants,
  resultName,
  onSubmit,
  submitting,
}) => {
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const participantResults = participants?.length
    ? Object.entries(participants).map(([k, v]) => {
        return {
          participantId: participants[k]._id,
          firstName: participants[k].firstName,
          lastName: participants[k].lastName,
          username: participants[k].username,
          time: participants[k]?.time,
          finalPoint: participants[k]?.finalPoint,
          resultId: participants[k]?.resultId,
        };
      })
    : [];

  const validate = Yup.object({
    results: Yup.array(
      Yup.object({
        time: Yup.string()
          .matches(
            /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/,
            'Time must match HH:MM:SS'
          )
          .required('Time is required'),
        finalPoint: Yup.number().required('Final point is required'),
      })
    ),
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
              <ModalContentTopTitle>
                Record Results ({resultName})
              </ModalContentTopTitle>
            </ModalContentTop>

            <ModalContentBottom>
              <Formik
                initialValues={{ results: participantResults }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) =>
                  onSubmit(values, { resetForm })
                }
              >
                {({ values, isValid }) => (
                  <Form style={{ width: '100%' }}>
                    <FieldArray name='results'>
                      {() => (
                        <>
                          {values.results.map((_, index) => (
                            <ResultContainer key={index}>
                              <ResultContainerLeft>
                                <ResultContainerDetailTitle>
                                  Participant
                                </ResultContainerDetailTitle>
                                {values.results[index].firstName}{' '}
                                {values.results[index].lastName.toUpperCase()} (
                                {values.results[index].username})
                              </ResultContainerLeft>
                              <ResultContainerRight>
                                <TextField
                                  name={`results[${index}].time`}
                                  label='Time'
                                  type='text'
                                  placeholder='00:00:00'
                                  width='350px'
                                />
                                <TextField
                                  name={`results[${index}].finalPoint`}
                                  label='Final Point'
                                  type='number'
                                  placeholder='0'
                                  width='350px'
                                />
                              </ResultContainerRight>
                            </ResultContainer>
                          ))}
                        </>
                      )}
                    </FieldArray>

                    <ButtonContainer>
                      <ButtonUpdate
                        type='submit'
                        disabled={!isValid || submitting}
                      >
                        SUBMIT{' '}
                        {submitting && (
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

export default ResultModal;
