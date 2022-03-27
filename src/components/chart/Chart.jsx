import React from 'react';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';

const ChartContainer = styled.div`
  margin: 20px;
  padding: 20px;
  -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const ChartTitle = styled.h3`
  margin-bottom: 20px;
`;

const Chart = ({ title, keys, values }) => {
  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <Bar
        data={{
          labels: [
            'Club 1',
            'Club 2',
            'Club 3',
            'Club 4',
            'Club 5',
            'Club 6',
            'Club 7',
            'Club 8',
            'Club 9',
            'Club 10',
          ], //keys,
          datasets: [
            {
              label: 'Top Clubs',
              data: [122, 100, 145, 120, 109, 133, 112, 103, 140, 134], //values,
              backgroundColor: [
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
                'rgba(121, 165, 217, 0.2)',
              ],
              borderColor: [
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
              ],
              borderWidth: 1,
            },
            {
              label: 'Club Size',
              data: [14, 10, 15, 13, 19, 13, 32, 43, 40, 34], //values,
              backgroundColor: [
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
                'rgba(0, 165, 217, 0.2)',
              ],
              borderColor: [
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
                'rgba(121, 145, 207, 0.2)',
              ],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    </ChartContainer>
  );
};

export default Chart;
