import React from 'react';
import styled from 'styled-components';

const FeaturedContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const FeaturedItem = styled.div`
  flex: 1;
  margin: 0px 20px;
  padding: 30px;
  border-radius: 10px;
  cursor: pointer;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const FeaturedTitle = styled.span`
  font-size: 20px;
`;

const FeaturedDataContainer = styled.div`
  margin: 10px 0px;
  display: flex;
  align-items: center;
`;

const FeaturedData = styled.span`
  font-size: 30px;
  font-weight: 600;
`;

const FeaturedDataDesc = styled.span`
  font-size: 15px;
  color: gray;
`;

const FeaturedInfo = () => {
  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
  });

  return (
    <FeaturedContainer>
      <FeaturedItem>
        <FeaturedTitle>Total Users</FeaturedTitle>
        <FeaturedDataContainer>
          <FeaturedData>{formatter.format(1293)}</FeaturedData>
        </FeaturedDataContainer>
        <FeaturedDataDesc>Current registered users</FeaturedDataDesc>
      </FeaturedItem>
      <FeaturedItem>
        <FeaturedTitle>Total Clubs</FeaturedTitle>
        <FeaturedDataContainer>
          <FeaturedData>{formatter.format(41599)}</FeaturedData>
        </FeaturedDataContainer>
        <FeaturedDataDesc>Current registered clubs</FeaturedDataDesc>
      </FeaturedItem>
      <FeaturedItem>
        <FeaturedTitle>Total Competitions</FeaturedTitle>
        <FeaturedDataContainer>
          <FeaturedData>{formatter.format(1800)}</FeaturedData>
        </FeaturedDataContainer>
        <FeaturedDataDesc>All-time no of competitions</FeaturedDataDesc>
      </FeaturedItem>
      <FeaturedItem>
        <FeaturedTitle>Open Competitions</FeaturedTitle>
        <FeaturedDataContainer>
          <FeaturedData>{formatter.format(568)}</FeaturedData>
        </FeaturedDataContainer>
        <FeaturedDataDesc>Current active competitions</FeaturedDataDesc>
      </FeaturedItem>
    </FeaturedContainer>
  );
};

export default FeaturedInfo;
