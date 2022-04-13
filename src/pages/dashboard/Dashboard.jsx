import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Chart from '../../components/chart/Chart';
import FeaturedInfo from '../../components/featuredInfo/FeaturedInfo';
import Sidebar from '../../components/sidebar/Sidebar';
import Topbar from '../../components/topbar/Topbar';
import { openRequest } from '../../apiRequests';

const Container = styled.div`
  display: flex;
  margin-top: 5px;
`;

const DashboardContainer = styled.div`
  flex: 4;
`;

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0);
  const [totalCompetitions, setTotalCompetitions] = useState(0);
  const [totalOpenCompetitions, setTotalOpenCompetitions] = useState(0);

  useEffect(() => {
    openRequest
      .get('/users/count')
      .then((result) => {
        setTotalUsers(result.data?.count);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    openRequest
      .get('/clubs/count')
      .then((result) => {
        setTotalClubs(result.data?.count);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    openRequest
      .get('/competitions/count')
      .then((result) => {
        setTotalCompetitions(result.data?.count);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    openRequest
      .get('/competitions/open/count')
      .then((result) => {
        setTotalOpenCompetitions(result.data?.count);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Topbar wMessage={true} />
      <Container>
        <Sidebar />
        <DashboardContainer>
          <FeaturedInfo
            totalUsers={totalUsers}
            totalClubs={totalClubs}
            totalCompetitions={totalCompetitions}
            totalOpenCompetitions={totalOpenCompetitions}
          />
          <Chart title='Clubs Analytics' keys={null} values={null} />
          {/* <Chart title='Swimmers Analytics' keys={null} values={null} /> */}
        </DashboardContainer>
      </Container>
    </>
  );
};

export default Dashboard;
