import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  padding: 20px;
`;

const Title = styled.span`
  font-size: 22px;
  font-weight: 600;
`;

const WidgetList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0px;
`;

const ListImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ListDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListDetail = styled.div`
  font-weight: 600;
`;

const ListButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 10px;
  padding: 7px 10px;
  background-color: #eeeef7;
  color: #555;
  cursor: pointer;
`;

const iconStyle = { fontSize: '16px !important', marginRight: '5px' };

const WidgetSm = ({ data, ...props }) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <WidgetList>
        {data?.map((item) => (
          <ListItem key={item._id}>
            <ListImg
              src={
                item.image ||
                'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'
              }
              alt='profile picture'
            />
            <ListDetailContainer>
              <ListDetail>
                {item.firstName} {item.lastName} ({item.username})
              </ListDetail>
            </ListDetailContainer>

            <Link to={`/profile/${item._id}`} className='link'>
              <ListButton>
                <FontAwesomeIcon icon={faEye} style={iconStyle} />
                View
              </ListButton>
            </Link>
          </ListItem>
        ))}
      </WidgetList>
    </Container>
  );
};

export default WidgetSm;
