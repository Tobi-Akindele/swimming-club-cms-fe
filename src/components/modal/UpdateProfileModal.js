import { Form, Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { openRequest } from '../../apiRequests';
import * as Yup from 'yup';
import TextField from '../formComponents/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { genderOptions, setAuthToken } from '../../utils';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../../firebase';
import Radio from '../formComponents/Radio';

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

const UpdateProfileModal = ({ showModal, setShowModal, user }) => {
  const modalRef = useRef();
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [updating, setUpdating] = useState(false);
  const [file, setFile] = useState(null);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const validate = Yup.object({
    firstName: Yup.string()
      .min(2, 'Too short')
      .max(40, 'Too long')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Too short')
      .max(40, 'Too long')
      .required('Last name is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    gender: Yup.string().required('Required'),
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
              <ModalContentTopTitle>Edit Profile</ModalContentTopTitle>
            </ModalContentTop>

            <ModalContentBottom>
              <Formik
                initialValues={{
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  middleName: user?.middleName,
                  dateOfBirth: user.dateOfBirth.split('T')[0],
                  phoneNumber: user.phoneNumber,
                  address: user.address,
                  gender: user.gender,
                }}
                validationSchema={validate}
                onSubmit={async (values, { resetForm }) => {
                  setUpdating(true);
                  if (file) {
                    const fileName = new Date().getTime() + file.name;
                    const storage = getStorage(app);
                    const storageRef = ref(storage, fileName);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    uploadTask.on(
                      'state_changed',
                      (snapshot) => {},
                      (err) => {
                        console.log(err);
                      },
                      () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                          async (downloadURL) => {
                            values['image'] = downloadURL;
                          }
                        );
                      }
                    );
                  }
                  openRequest
                    .put(
                      `/user/profile/update/${user._id}`,
                      values,
                      setAuthToken(currentUser.accessToken)
                    )
                    .then((result) => {
                      setUpdating(false);
                      setFile(null);
                      resetForm({});
                      toast.success('Update successful');
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    })
                    .catch((err) => {
                      setUpdating(false);
                      let message = err.response?.data?.message
                        ? err.response?.data?.message
                        : err.message;
                      toast.error(message);
                    });
                }}
              >
                {(formik) => (
                  <Form>
                    <TextField
                      name='file'
                      type='file'
                      label='Profile Image'
                      accept='image/png, image/jpeg, image/jpg'
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                      }}
                      width='350px'
                    />

                    <TextField
                      name='firstName'
                      type='text'
                      placeholder={user.firstName}
                      label='First Name'
                      width='350px'
                    />

                    <TextField
                      name='lastName'
                      type='text'
                      placeholder={user.lastName}
                      label='Last Name'
                      width='350px'
                    />

                    <TextField
                      name='middleName'
                      type='text'
                      placeholder={user.middleName}
                      label='Middle Name'
                      width='350px'
                    />

                    <TextField
                      name='dateOfBirth'
                      type='date'
                      label='Date of Birth'
                      value={user.dateOfBirth.split('T')[0]}
                      width='350px'
                    />
                    <TextField
                      name='phoneNumber'
                      type='text'
                      placeholder={user.phoneNumber}
                      label='Phone Number'
                      width='350px'
                    />
                    <TextField
                      name='address'
                      type='text'
                      placeholder={user.address}
                      label='Address'
                      width='350px'
                    />
                    <Radio
                      label='Gender'
                      name='gender'
                      options={genderOptions}
                      value={user.gender}
                      width='350px'
                    />

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

export default UpdateProfileModal;
