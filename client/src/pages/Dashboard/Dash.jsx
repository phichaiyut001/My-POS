import {
  // BsFillArchiveFill,
  // BsFillGrid3X3GapFill,
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
  LineChart,
  Line,
} from "recharts";

import { Card, Col, Row, Statistic, Tabs, Table, Badge } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import axios from "axios";
import React, { useState, useEffect } from "react";
import moment from "moment";
import _ from "lodash";

const columns = [
  {
    title: "สินค้าขายดี",
    dataIndex: "",
    render: (_, record, index) => (
      <Badge count={index + 1} style={{ backgroundColor: "#52c41a" }} />
    ),
  },
  { title: "ชื่อสินค้า", dataIndex: "name" },
  {
    title: "Image",
    dataIndex: "image",
    render: (image, record) => (
      <img src={`/images/${image}`} alt={record.name} height="60" width="60" />
    ),
  },
  { title: "ราคา", dataIndex: "price" },
  { title: "จำนวนที่ขายได้", dataIndex: "amount" },
  { title: "หมวดหมู่", dataIndex: "category" },
];

const Dash = () => {
  const dispatch = useDispatch();
  const [usersData, setUsersData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [topSellingItemsData, setTopSellingItemsData] = useState([]);
  const [dailyRevenueData, setDailyRevenueData] = useState([]);

  const getAllUsers = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/users/get-users");
      const usersWithIndex = data.map((users, index) => ({
        ...users,
        index: index + 1,
      }));
      setUsersData(usersWithIndex);
      dispatch({ type: "HIDE_LOADING" });
      //  console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/items/get-item");
      const itemWithIndex = data.map((items, index) => ({
        ...items,
      }));
      setItemsData(itemWithIndex);
      dispatch({ type: "HIDE_LOADING" });
      //  console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/bills/get-bills");
      const billsWithIndex = data.map((bill, index) => ({
        ...bill,
      }));

      setBillsData(billsWithIndex);
      dispatch({ type: "HIDE_LOADING" });
      // console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers();
      await getAllItems();
      await getAllBills();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const topSellingItems = getTopSellingItems(billsData, itemsData, 5);
    setTopSellingItemsData(topSellingItems);
  }, [billsData, itemsData]);

  useEffect(() => {
    const weekRevenue = getWeekRevenueData();
    setDailyRevenueData(weekRevenue);
  }, [billsData, itemsData]);

  const getTotalRevenue = () => {
    return billsData.reduce((total, bill) => total + bill.subTotal, 0);
  };

  const getTotalRevenuePerDay = () => {
    // ตัวแปร currentDate สามารถใช้เพื่อกรองข้อมูลตามวันที่ต้องการ
    // ในกรณีนี้คือวันปัจจุบัน
    const currentDate = new Date();

    // กรอง billsData เฉพาะบิลที่มีวันที่ตรงกับ currentDate
    const filteredBills = billsData.filter((bill) => {
      const billDate = new Date(bill.date);
      return (
        billDate.getDate() === currentDate.getDate() &&
        billDate.getMonth() === currentDate.getMonth() &&
        billDate.getFullYear() === currentDate.getFullYear()
      );
    });

    // คำนวณรายได้รวมจาก filteredBills
    const totalRevenue = filteredBills.reduce(
      (total, bill) => total + bill.subTotal,
      0
    );

    return totalRevenue;
  };

  // ตัวอย่างการใช้งาน
  const dailyRevenue = getTotalRevenuePerDay();
  console.log(`Total revenue for today: ${dailyRevenue}`);

  const getAverageSubtotalPerBill = () => {
    const totalBills = billsData.length;
    const totalSubtotal = getTotalRevenue();
    return totalBills > 0 ? totalSubtotal / totalBills : 0;
  };

  const paymentModeCounts = billsData.reduce((counts, item) => {
    const paymentMode = item.paymentMode;

    // ถ้ายังไม่มี property นี้ใน counts ให้เพิ่มขึ้นมา
    if (!counts[paymentMode]) {
      counts[paymentMode] = 1;
    } else {
      // ถ้ามีแล้วให้เพิ่มจำนวน
      counts[paymentMode]++;
    }

    return counts;
  }, {});

  //  console.log(paymentModeCounts);

  const allMonths = moment.monthsShort(); // ชื่อเดือนทั้ง 12 เดือน
  const monthlyRevenueData = allMonths.reduce((monthlyData, month) => {
    monthlyData[month] = 0;
    return monthlyData;
  }, {});

  // นับรายได้จากข้อมูลที่มีอยู่
  billsData.forEach((bill) => {
    const month = moment(bill.date).format("MMM");
    monthlyRevenueData[month] += bill.subTotal;
  });

  const data = Object.keys(monthlyRevenueData).map((month) => ({
    month,
    revenue: monthlyRevenueData[month],
    color: "#8884d8",
  }));

  const datas = [
    { paymentMethod: "เงิดสด", amount: paymentModeCounts["cash"] },
    { paymentMethod: "โอน", amount: paymentModeCounts["promptpay"] },
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

  // ข้อความที่ต้องการแสดง

  const getWeekRevenueData = () => {
    // Sort billsData by date in descending order
    const sortedBills = _.orderBy(billsData, ["date"], ["desc"]);

    // Extract the dates from the sorted billsData
    const billDates = sortedBills.map((bill) =>
      moment(bill.date).format("DD-MM-YYYY")
    );

    // Get unique dates and take the latest 7 (if available)
    const uniqueDates = _.uniq(billDates);
    const selectedDates = uniqueDates.slice(0, 7);

    // Filter billsData to include only data for the selected dates
    const filteredBills = billsData.filter((bill) => {
      const billDate = moment(bill.date).format("DD-MM-YYYY");
      return selectedDates.includes(billDate);
    });

    const dailyRevenue = _.groupBy(filteredBills, (bill) =>
      moment(bill.date).format("DD-MM-YYYY")
    );

    const chartData = selectedDates.map((date) => {
      const totalRevenue = dailyRevenue[date]
        ? dailyRevenue[date].reduce((total, bill) => total + bill.subTotal, 0)
        : 0;
      return {
        date,
        revenue: totalRevenue,
      };
    });

    return chartData;
  };

  const getTopSellingItems = (billsData, itemsData, limit = 5) => {
    const itemsSales = {};

    billsData.forEach((bill) => {
      bill.cartItems.forEach((cartItem) => {
        const itemId = cartItem._id;
        const itemAmount = cartItem.quantity;

        if (!itemsSales[itemId]) {
          itemsSales[itemId] = 0;
        }

        itemsSales[itemId] += itemAmount;
      });
    });

    const sortedItems = Object.keys(itemsSales).sort(
      (a, b) => itemsSales[b] - itemsSales[a]
    );

    const topSellingItems = sortedItems.slice(0, limit);

    const tableData = topSellingItems.map((itemId) => {
      const item = itemsData.find((data) => data._id === itemId);
      return {
        key: itemId,
        name: item.name,
        image: item.image,
        price: item.price,
        amount: itemsSales[itemId],
        category: item.category,
      };
    });

    return tableData;
  };

  return (
    <LayoutAdmin>
      <main className="main-container">
        <Row gutter={16} style={{ display: "flex" }}>
          <Col span={12} style={{ flex: 1 }}>
            <Card bordered={false}>
              <Statistic
                title="รายได้ทั้งหมด"
                value={getTotalRevenue()}
                //   precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={<ArrowUpOutlined />}
                suffix="฿"
                formatter={(value) => value.toLocaleString()}
              />
            </Card>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Card bordered={false}>
              <Statistic
                title="รายได้เฉลี่ยต่อบิล"
                value={getAverageSubtotalPerBill()}
                precision={0}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={""}
                suffix="฿"
              />
            </Card>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Card bordered={false}>
              <Statistic
                title="รายได้รายวัน"
                value={getTotalRevenuePerDay()}
                //    precision={2}
                valueStyle={{
                  color: "#3f8600",
                }}
                prefix={""}
                suffix="฿"
              />
            </Card>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Card bordered={false}>
              <Statistic
                title="ผู้ใช้งาน"
                value={usersData.length}
                valueStyle={{
                  color: "#3498DB",
                }}
                prefix={<BsPeopleFill />}
                suffix=""
              />
            </Card>
          </Col>
          <Col span={12} style={{ flex: 1 }}>
            <Card bordered={false}>
              <Statistic
                title="บิล"
                value={billsData.length}
                valueStyle={{
                  color: "#3498DB",
                }}
                prefix={<BsFillBellFill />}
                suffix=""
              />
            </Card>
          </Col>
        </Row>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: "สรุปยอดรายเดือน",
              key: "1",
              children: (
                <Card bordered={false}>
                  <h1>สรุปยอดรายเดือน</h1>
                  <div className="charts">
                    <div className="chart-container">
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
                    </div>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400}>
                          <Pie
                            data={datas}
                            dataKey="amount"
                            nameKey="paymentMethod"
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={100}
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
                  </div>
                </Card>
              ),
            },
            {
              label: "สรุปยอดรายสัปดาห์",
              key: "2",
              children: (
                <Card bordered={false}>
                  <h1>สรุปยอดรายสัปดาห์</h1>
                  <div className="charts">
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          width={600}
                          height={300}
                          data={getWeekRevenueData()}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="revenue" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              ),
              //disabled: true,
            },
            {
              label: "สินค้าขายดี",
              key: "3",
              children: (
                <Card bordered={false}>
                  <h1>สินค้าขายดี</h1>
                  <Table
                    columns={columns}
                    dataSource={topSellingItemsData}
                    bordered
                  />
                </Card>
              ),
            },
          ]}
        />
      </main>
    </LayoutAdmin>
  );
};

export default Dash;
