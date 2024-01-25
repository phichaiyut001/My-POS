import React from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import LayoutAdmin from "./components/LayoutAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dash() {
  const data = [
    { month: "Jan", revenue: 10000, color: "#8884d8" },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 12000 },
    { month: "Apr", revenue: 18000 },
    { month: "May", revenue: 20000 },
    { month: "Jun", revenue: 25000 },
    { month: "Jul", revenue: 22000 },
    { month: "Aug", revenue: 18000 },
    { month: "Sep", revenue: 20000 },
    { month: "Oct", revenue: 23000 },
    { month: "Nov", revenue: 21000 },
    { month: "Dec", revenue: 28000 },
  ];

  const datas = [
    { paymentMethod: "โอน", amount: 49 },
    { paymentMethod: "เงินสด", amount: 51 },
  ];

  const colors = ["#8884d8", "#82ca9d"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <LayoutAdmin>
      <main className="main-container">
        <div className="main-title">
          <h3>DASHBOARD</h3>
        </div>
        <div className="main-cards">
          <div className="card">
            <div className="card-inner">
              <h3>PRODUCTS</h3>
              <BsFillArchiveFill className="card_icon" />
            </div>
            <h1>25</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>CATEGORIES</h3>
              <BsFillGrid3X3GapFill className="card_icon" />
            </div>
            <h1>4</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>User</h3>
              <BsPeopleFill className="card_icon" />
            </div>
            <h1>3</h1>
          </div>
          <div className="card">
            <div className="card-inner">
              <h3>Bills</h3>
              <BsFillBellFill className="card_icon" />
            </div>
            <h1>125</h1>
          </div>
        </div>
        <div className="charts">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={600} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height="100%">
            {/* <PieChart width={400} height={400}>
            <Pie
              data={datas}
              cx="50%"
              cy="50%"
              dataKey="amount"
              nameKey="paymentMethod"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={150}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart> */}
            <PieChart width={400} height={400}>
              <Pie
                data={datas}
                dataKey="amount"
                nameKey="paymentMethod"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </LayoutAdmin>
  );
}

export default Dash;
