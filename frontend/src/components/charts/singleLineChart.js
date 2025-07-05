import { LineChart } from '@mui/x-charts/LineChart';


const margin = { right: 24 };

export default function SingleLineChart({ data }) {
  const xData = data.map(entry => entry.date);
  const yData = data.map(entry => entry.totalSubscriptions);
  const seenDays = new Set();

  const displayXLabels = xData.map((value) => {
    const date = new Date(value);
    const dayKey = date.toISOString().split('T')[0]; // "YYYY-MM-DD"

    if (seenDays.has(dayKey)) return ''; // Skip label
    seenDays.add(dayKey);

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short'
    }).format(date); // e.g., "04 Jul"
  });

  
  const FormatDate = (value) => {
    const index = xData.indexOf(value);
    return displayXLabels[index] || '';
  };
  return (
    <LineChart
      
      slotProps={{
          legend: {
            direction: 'horizontal',
            position: { 
              vertical: 'top',
              horizontal: 'center'
            }
          },
          // tooltip: {
          //   disablePortal: true,
          // }
        }}
      hideLegend={false}
      xAxis={[{ data: xData, scaleType: 'point',label: 'Date',valueFormatter: FormatDate }]}
      series={[{ data: yData, label: 'Total Subscriptions',labelMarkType: 'circle'}]}
      height={300}
      margin={margin}
    />
  );
      
  
}


