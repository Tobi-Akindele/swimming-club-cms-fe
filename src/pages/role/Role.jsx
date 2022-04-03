import {
  faCheck,
  faSpinner,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { format } from 'timeago.js';
import { openRequest } from '../../apiRequests';
import SearchInput from '../../components/formComponents/SearchInput';
import PermissionModal from '../../components/modal/PermissionModal';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
// import {
//   getRoleByIdFailure,
//   getRoleByIdStart,
//   getRoleByIdSuccess,
// } from '../../redux/roleRedux';
import { setAuthToken } from '../../utils';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const RoleContainer = styled.div`
  flex: 4;
  padding: 20px;
`;

const RoleTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RoleTitle = styled.h1``;

const RoleDetailContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const RoleDetailTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: rgb(175, 170, 170);
`;

const RoleDetailInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
  color: #444;
`;

const RoleDetailText = styled.span`
  margin-left: 10px;
`;

const AddPermissionContainer = styled.div`
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

const PermissionContainer = styled.div`
  flex-direction: column;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const PermissionTitle = styled.h2``;

const Permissions = styled.div``;

const PermissionTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0px;
`;

const Role = () => {
  const location = useLocation();
  const roleId = location.pathname.split('/')[2];
  const role = useSelector((state) =>
    state.role.roles.find((role) => role._id === roleId)
  );
  const currentUser = useSelector((state) => state.login?.currentUser);
  const [query, setQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [permissions, setPermissions] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setIsFetching(true);
    openRequest
      .get(
        `/role/${role._id}/permissions`,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        setIsFetching(false);
        setPermissions(result.data);
      })
      .catch((err) => {
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
        setIsFetching(false);
      });
  }, [currentUser, role]);

  const search = (data) => {
    if (data) {
      return data.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    return data;
  };

  const permissionRows = permissions
    ? Object.entries(search(permissions)).map(([k, v]) => {
        return {
          ...v,
          id: permissions[k]._id,
        };
      })
    : [];

  const handDeletePermission = (e) => {
    e.preventDefault();
    const payload = {
      roleId: roleId,
      permissionIds: selectedRows,
    };
    setIsDeleting(true);
    openRequest
      .post(
        '/remove/permissions',
        payload,
        setAuthToken(currentUser.accessToken)
      )
      .then((result) => {
        setIsDeleting(false);
        toast.success('Permission(s) removed successfully');
        window.location.reload();
      })
      .catch((err) => {
        setIsDeleting(false);
        let message = err.response?.data?.message
          ? err.response?.data?.message
          : err.message;
        toast.error(message);
      });
  };

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 500,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 500,
    },
  ];

  const openModal = (e) => {
    e.preventDefault();
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <Topbar wMessage={false} />
      <Container>
        <Sidebar />
        <RoleContainer>
          <RoleTitleContainer>
            <RoleTitle>Role</RoleTitle>
          </RoleTitleContainer>
          <RoleDetailContainer>
            <RoleDetailTitle>Role Details</RoleDetailTitle>
            <RoleDetailInfo>
              Name:
              <RoleDetailText>{role.name}</RoleDetailText>
            </RoleDetailInfo>
            <RoleDetailInfo>
              Created:
              <RoleDetailText>{format(role._created)}</RoleDetailText>
            </RoleDetailInfo>
            <RoleDetailInfo>
              Status:
              <RoleDetailText>
                <span
                  style={{
                    border: `1px solid ${role.assignable ? 'green' : 'red'}`,
                    width: '70px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    padding: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {role.assignable ? (
                    <>
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: '#3bb077' }}
                      />{' '}
                      Assignable
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        style={{ color: 'red' }}
                      />{' '}
                      Unassignable
                    </>
                  )}
                </span>
              </RoleDetailText>
            </RoleDetailInfo>
          </RoleDetailContainer>

          <AddPermissionContainer>
            {selectedRows.length ? (
              <ButtonDelete onClick={handDeletePermission}>
                REMOVE ({selectedRows.length}) SELECTED
                {isDeleting ? <FontAwesomeIcon icon={faSpinner} spin /> : null}
              </ButtonDelete>
            ) : null}
            {role.updatable ? (
              <ButtonCreate onClick={openModal}>ADD PERMISSION</ButtonCreate>
            ) : (
              <ButtonCreate disabled>ADD PERMISSION</ButtonCreate>
            )}
          </AddPermissionContainer>

          <PermissionContainer>
            <PermissionTopContainer>
              <PermissionTitle>Permissions</PermissionTitle>
              <SearchInput
                type='text'
                placeholder='Search'
                onChange={(e) => setQuery(e.target.value)}
                width='300px'
              />
            </PermissionTopContainer>
            {isFetching ? (
              <FontAwesomeIcon
                icon={faSpinner}
                style={{ fontSize: '50px' }}
                spin
              />
            ) : (
              <Permissions>
                <DataGrid
                  rows={permissionRows}
                  columns={columns}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: '_created', sort: 'desc' }],
                    },
                  }}
                  autoHeight
                  pageSize={10}
                  rowHeight={40}
                  checkboxSelection={role.updatable}
                  rowsPerPageOptions={[10]}
                  onSelectionModelChange={(ids) => {
                    setSelectedRows(ids);
                  }}
                />
              </Permissions>
            )}
          </PermissionContainer>
        </RoleContainer>
        <PermissionModal
          showModal={showModal}
          setShowModal={setShowModal}
          existingPermission={permissionRows}
          roleId={roleId}
        />
      </Container>
    </>
  );
};

export default Role;
