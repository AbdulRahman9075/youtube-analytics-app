import {useState} from 'react';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Slider from '@mui/material/Slider';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieAnimation({Data}) {
  const [highlight] = useState('item');
  const [fade] = useState('global');


  const formatter = (item) => `${item.value} %`;
  // const currentCategoryCounts = Object.entries(categoryCounts).map(([key, value]) => ({
  //   key,
  //   label: key === 'Uncategorized' ? 'Uncategorized' : key,
  //   value: normalize(value, data.length)
  // }));

  const pieChartsParams = {
    series: [
      {
        data: Data,
        //label: 'Series 1',
        innerRadius: 50,
        highlight: { additionalRadius: 50 },
        //arcLabel: (params) => params.label ?? '',
        arcLabelMinAngle: 20,
        labelMarkType: 'circle',
      },
    ],
    height: 300,
    width: 300,
    //margin: { top: 50, bottom: 50 },
  };
  return (
    <Box sx={{ width: '100%' }}>
      {/* <PieChart
        slotProps={{
          legend: {
            direction: 'vertical',
            position: { 
              vertical: 'top',
              horizontal: 'center'
            }
          }
        }}
        hideLegend={false}
        height={300}
        width={300}
        series={[
          {
            data: Data,
            innerRadius: 50,
            arcLabel: (params) => params.label ?? '',
            arcLabelMinAngle: 20,
            Formatter,
            labelMarkType: 'circle',
          },
        ]}
        skipAnimation={false}
      /> */}

      <PieChart
        {...pieChartsParams}
        slotProps={{
          legend: {
            direction: 'vertical',
            position: { 
              vertical: 'top',
              horizontal: 'center'
            }
          }
        }}
        hideLegend={false}
        // height={300}
        // width={300}
        // series={[
        //   {
        //     data: Data,
        //     innerRadius: 50,
        //     arcLabel: (params) => params.label ?? '',
        //     arcLabelMinAngle: 20,
        //     Formatter,
        //     labelMarkType: 'circle',
        //   },
        // ]}
        series={pieChartsParams.series.map((series) => ({
              ...series,
              valueFormatter: (v) => (v === null ? '' : formatter(v)),
              highlightScope: {
                highlight,
                fade,
              },
            }))}
            

        skipAnimation={false}
      />

    </Box>
  );
}
