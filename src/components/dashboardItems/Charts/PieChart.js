




import React from 'react';
import ApexCharts from 'react-apexcharts';

const PieChart = ({ data }) => {

  const categoryCounts = {};

  
  data.forEach(item => {
    if (item.categories) {
      categoryCounts[item.categories] = (categoryCounts[item.categories] || 0) + 1;
    }
  });


  const categories = Object.keys(categoryCounts);
  const series = Object.values(categoryCounts);

  const options = {
    series,
    chart: {
      width: 400,//400
      type: 'donut',
    },
    labels: categories,
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
    },
    legend: {
      formatter: function(val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      },
    },
    title: {
      text: 'Categories',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <ApexCharts
        options={options}
        series={series}
        type="donut"
        width={options.chart.width}
      />
    </div>
  );
};

export default PieChart;


/**import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = () => {
  const data = {
    labels: ['Category 1', 'Category 2', 'Category 3'],
    datasets: [{
      label: 'Category Distribution',
      data: [10, 20, 30],
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart; */
