import { Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { openRequest } from '../../apiRequests';
import * as Yup from 'yup';
import TextField from '../formComponents/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import Switch from '../formComponents/switch/Switch';
import DataListInput from '../formComponents/DataListInput';
import { setAuthToken } from '../../utils';
import {
  updateClubFailure,
  updateClubStart,
  updateClubSuccess,
} from '../../redux/clubRedux';

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
  height: 50%;
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

const UpdateClubModal = ({ showModal, setShowModal, club }) => {
  const modalRef = useRef();
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [updateCoach, setUpdateCoach] = useState(false);
  const { isFetching: updating } = useSelector((state) => state.club);
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
        },
      };
      try {
        const response = await openRequest.get('/club/name', config);
        if (response?.data?._id !== club._id) {
          return createError({ path, message: eMessage });
        }
        return true;
      } catch (error) {
        return true;
      }
    });
  }

  Yup.addMethod(Yup.mixed, 'isUniqueName', isUniqueName);
  const validate = Yup.object({
    name: Yup.string()
      .min(2, 'Too short')
      .isUniqueName('Club is taken')
      .required('Club name is required'),
    coachId: Yup.string()
      .min(3, 'Please enter at least 3 characters')
      .required('Coach is required'),
  });

  const loadOptions = async (inputText, callback) => {
    let config = {
      headers: {
        username: inputText,
        userType: 'coach',
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
              <ModalContentTopTitle>Edit Club</ModalContentTopTitle>
            </ModalContentTop>

            <ModalContentBottom>
              <Formik
                initialValues={{ name: club?.name, coachId: club?.coach?._id }}
                validationSchema={validate}
                onSubmit={(values, { resetForm }) => {
                  const payload = { ...values };
                  dispatch(updateClubStart());
                  openRequest
                    .put(
                      `/club/update/${club._id}`,
                      payload,
                      setAuthToken(currentUser.accessToken)
                    )
                    .then((result) => {
                      resetForm({});
                      dispatch(updateClubSuccess(result.data));
                      toast.success('Update successful');
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    })
                    .catch((err) => {
                      let message = err.response?.data?.message
                        ? err.response?.data?.message
                        : err.message;
                      toast.error(message);
                      dispatch(updateClubFailure());
                    });
                }}
              >
                {(formik) => (
                  <Form>
                    <TextField
                      name='name'
                      type='text'
                      placeholder='New Club Name'
                      label='Name'
                      width='350px'
                    />
                    <Switch
                      type='checkbox'
                      id='update-coach-switch'
                      label='Update Coach'
                      isOn={updateCoach}
                      handleToggle={() => setUpdateCoach(!updateCoach)}
                    />
                    {updateCoach ? (
                      <DataListInput
                        value={formik.values.coachId}
                        name='coachId'
                        type='text'
                        placeholder='Search Coach'
                        label='Coach'
                        onChange={formik.setFieldValue}
                        onBlur={formik.setFieldTouched}
                        loadOptions={loadOptions}
                        error={formik.errors.coachId}
                        touched={formik.touched.coachId}
                      />
                    ) : null}
                    <ButtonContainer>
                      <ButtonUpdate
                        type='submit'
                        disabled={!formik.dirty || !formik.isValid || updating}
                      >
                        UPDATE{' '}
                        {updating && <FontAwesomeIcon icon={faSpinner} spin />}
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

export default UpdateClubModal;
