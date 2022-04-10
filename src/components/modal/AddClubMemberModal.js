import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { openRequest } from '../../apiRequests';
import * as Yup from 'yup';
import { setAuthToken } from '../../utils';
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

const AddClubMemberModal = ({ showModal, setShowModal, clubId }) => {
  const modalRef = useRef();
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [registering, setRegistering] = useState(false);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const validate = Yup.object({
    userId: Yup.string().required('Value is required'),
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
              <ModalContentTopTitle>Member Registration</ModalContentTopTitle>
            </ModalContentTop>

            <ModalContentBottom>
              <Formik
                initialValues={{ userId: '' }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  const payload = {
                    clubId: clubId,
                    memberId: values.userId,
                  };
                  setRegistering(true);
                  openRequest
                    .post(
                      '/club/add/member',
                      payload,
                      setAuthToken(currentUser.accessToken)
                    )
                    .then((result) => {
                      setRegistering(false);
                      resetForm({});
                      toast.success('Registration successful');
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    })
                    .catch((err) => {
                      setRegistering(false);
                      let message = err.response?.data?.message
                        ? err.response?.data?.message
                        : err.message;
                      toast.error(message);
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
                      label='Member Name'
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
                          !formik.dirty || !formik.isValid || registering
                        }
                      >
                        REGISTER{' '}
                        {registering && (
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

export default AddClubMemberModal;
