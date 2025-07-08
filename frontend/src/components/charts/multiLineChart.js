import { LineChart} from '@mui/x-charts/LineChart';
import Constant from '../../assets/constants.js';

const margin = { right: 24 };



export default function MultiLineChart({ data }) {
  // Extract x-axis data (timestamps)
  const xLabels = data.map(entry => entry.date);

  const seenDays = new Set();

  const displayXLabels = xLabels.map((value) => {
    const date = new Date(value);
    const dayKey = date.toISOString().split('T')[0]; // "YYYY-MM-DD"

    if (seenDays.has(dayKey)) return ''; // Skip label
    seenDays.add(dayKey);

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    }).format(date); // e.g., "04 Jul"
  });

  
  const FormatDate = (value) => {
    const index = xLabels.indexOf(value);
    return displayXLabels[index] || '';
  };
  // Initialize y-series data per category
  const categorySeriesMap = {};
  Constant.CATEGORY_LIST.forEach(category => {
    categorySeriesMap[category] = new Array(data.length).fill(0);
  });

  // Populate category counts per data point
  data.forEach((entry, index) => {
    const counts = entry.categoryCounts || [];
    counts.forEach(({ category, count }) => {
      if (categorySeriesMap[category] !== undefined) {
        categorySeriesMap[category][index] = count;
      }
    });
  });

  // const formatDate = (value) => {
  //   const date = new Date(value);
  //   return new Intl.DateTimeFormat('en-GB', {
  //     day: '2-digit',
  //     month: 'short',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   }).format(date);
  // };


  return (
    <LineChart
      slotProps={{
          legend: {
            sx: {
              fontSize: 14,
            },
            direction: 'horizontal',
            position: { 
              vertical: 'top',
              horizontal: 'start'
            }
          },
          tooltip: {
            trigger: 'axis'
          }
        }}
      

      hideLegend={true}
      height={300}
      xAxis={[{
        scaleType: 'point',
        data: xLabels,
        label: 'Date',
        valueFormatter: FormatDate  //replace with formatDate if error
      }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
      series={Constant.CATEGORY_LIST.filter(category => categorySeriesMap[category].some(count => count > 0)).map(category => ({
        data: categorySeriesMap[category],
        label: category,
        color: Constant.CATEGORY_COLORMAP_LIGHT[category] || '#000000',
        connectNulls: true,
        labelMarkType: 'circle',
        
        
      }))}
    />
  );
}