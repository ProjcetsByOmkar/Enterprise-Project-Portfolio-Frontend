import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import "./dashboard.css";
import Logo from "../img/Logo.svg";
import bg from "../img/Header-bg.svg";

Chart.register(...registerables);

const Dashboard = () => {
  const [counters, setCounters] = useState({
    totalProjects: 0,
    closedProjects: 0,
    runningProjects: 0,
    closureDelayedProjects: 0,
    cancelledProjects: 0,
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const countersResponse = await axios.get(
          "http://localhost:5000/api/getCounters"
        );
        setCounters(countersResponse.data);

        const departmentResponse = await axios.get(
          "http://localhost:5000/api/getDepartmentStats"
        );
        const departmentData = departmentResponse.data;
        setDepartmentData(departmentData);
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const departmentChartData = {
    labels: departmentData.map((dep) => dep._id),
    datasets: [
      {
        label: "Total",
        data: departmentData.map((dep) => dep.totalProjects),
        backgroundColor: "#007bff",
        borderRadius: 15,
        barThickness: 26,
        borderSkipped: false,
        borderWidth: 8,
        base: 0.1,
        borderColor: "transparent",
      },
      {
        label: "Closed",
        data: departmentData.map((dep) => dep.closedProjects),
        backgroundColor: "#28a745",
        borderRadius: 15,
        barThickness: 26,
        borderSkipped: false,
        borderWidth: 8,
        base: 0.1,
        borderColor: "transparent",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          padding: 10,
        },
      },
      y: {
        beginAtZero: true,
        max: 20,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 40,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: -5,
      },
    },
  };

  const barValuePlugin = {
    id: "barValuePlugin",
    afterDatasetsDraw: (chart) => {
      const { ctx } = chart;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        meta.data.forEach((bar, index) => {
          const value = dataset.data[index];
          const department = departmentData[index];
          const percentage = (
            (department.closedProjects / department.totalProjects) *
            100
          ).toFixed(1);

          const xPosition = bar.x;
          const yPosition = bar.y - 10;

          ctx.fillStyle = "#000";
          ctx.font = "bold 12px Arial";

          ctx.fillText(value, xPosition, yPosition - -18);

          if (datasetIndex === 1) {
            ctx.fillText(
              `${percentage}%`,
              xPosition - 15,
              chart.scales.y.bottom + 20
            );
          }
        });
      });
    },
  };

  if (loading) {
    return <div className="loading">Loading data, please wait...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <React.Fragment>
      <div className="dashboar-body" style={{ width: "100%" }}>
        <div>
          <h2>Dashboard</h2>
          <img src={bg} alt="Background" className="bgimage" />
        </div>
        <div>
          <img src={Logo} alt="Company Logo" className="company-logo" />

          <div className="project-stats">
            {Object.entries(counters).map(([key, value]) => (
              <div className="stat-box" key={key}>
                <h3>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                </h3>
                <p>{value}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "black" }}>Department wise - Total vs Closed</p>
          <div className="bar-chart">
            <Bar
              data={departmentChartData}
              options={chartOptions}
              plugins={[barValuePlugin]}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
