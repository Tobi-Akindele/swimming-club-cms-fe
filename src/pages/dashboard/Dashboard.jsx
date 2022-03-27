import React from 'react';
import styled from 'styled-components';
import Chart from '../../components/chart/Chart';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const DashboardContainer = styled.div`
  flex: 4;
`;

const Dashboard = () => {
  return (
    <>
      <Topbar wMessage={true} />
      <Container>
        <Sidebar />
        <DashboardContainer>
          <FeaturedInfo />
          <Chart title='Clubs Analytics' keys={null} values={null} />
          {/* <Chart title='Swimmers Analytics' keys={null} values={null} /> */}
        </DashboardContainer>
      </Container>
    </>
  );
};

export default Dashboard;
