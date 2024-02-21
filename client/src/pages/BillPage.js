import React, { useState, useEffect, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { EyeOutlined } from "@ant-design/icons";
import { Table, Modal, Button } from "antd";
import "../styles/Invoice.css";
import { useReactToPrint } from "react-to-print";

const BillPage = () => {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const dispatch = useDispatch();
  const [popupModal, setPopupModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  //useEffect
  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });

      const { data } = await axios.get("/api/bills/get-bills");

      // เพิ่ม index ให้กับแต่ละบิล
      const billsWithIndex = data.map((bill, index) => ({
        ...bill,
        index: index + 1,
      }));

      // เรียงลำดับบิลตาม index ล่าสุดไปยังเก่าสุด
      const sortedBills = billsWithIndex.sort((a, b) => b.index - a.index);

      setBillsData(sortedBills);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBills();
  }, []);

  //handle print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  //able data

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);

    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "Asia/Bangkok", // Specify the Bangkok time zone
    };

    return date.toLocaleString("en-GB", options); // Use 'en-GB' for the desired date format
  };

  const loggedInUser = JSON.parse(localStorage.getItem("auth"));
  const currentUser = loggedInUser.name; // หรือชื่อ field ที่เก็บชื่อผู้ใช้ที่ login ใน LocalStorage

  const filteredBills = billsData.filter((bill) => {
    return bill.sellname === currentUser;
  });

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      width: 60,
    },
    {
      title: "ชื่อสินค้า",
      dataIndex: "cartItems",
      render: (cartItems) => (
        <ul style={{ listStyle: "square" }}>
          {cartItems.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      ),
    },
    { title: "คนที่ขาย", dataIndex: "sellname" },
    { title: "วิธีการจ่าย", dataIndex: "paymentMode" },
    { title: "ราคาทั้งหมด", dataIndex: "subTotal" },
    { title: "รับเงิน", dataIndex: "change" },
    { title: "เงินทอน", dataIndex: "changeAmount" },
    {
      title: "วันที่",
      dataIndex: "date",
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
      render: (date) => formatDate(date), // เรียกใช้ฟังก์ชัน formatDate
    },

    {
      title: "",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>รายการใบเสร็จการขาย</h1>
      </div>
      <Table columns={columns} dataSource={filteredBills} bordered />

      {popupModal && (
        <Modal
          width={400}
          pagination={false}
          title="รายละเอียดใบเสร็จ"
          visible={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="info">
                <h2>POS ร้านข้าวปลาทอด</h2>
                <p>
                  ติดต่อสั่งซื้อได้ที่ :097-350-8080 | Delivery Lineman, Grab
                  "ร้านข้าวปลาทอด"
                </p>
              </div>
              {/* End info */}
            </center>

            <div id="mid">
              <div className="mt-">
                <p>
                  พนักงานขาย : <b>{selectedBill.sellname}</b>
                  <br />
                  Date : <b>{formatDate(selectedBill.date)}</b>
                  <br />
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/* End invoice mid */}
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>ชื่อสินค้า</h2>
                      </td>
                      <td className="Hours">
                        <h2>จำนวน</h2>
                      </td>

                      <td className="Rate">
                        <h2>ราคา</h2>
                      </td>
                      <td className="Rate">
                        <h2>ทั้งหมด</h2>
                      </td>
                      <td className="Rate"></td>
                    </tr>
                    {selectedBill.cartItems.map((item) => (
                      <>
                        <tr className="service">
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.price.toLocaleString()}
                            </p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {(item.quantity * item.price).toLocaleString()}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}
                    <tr className="tabletitle">
                      <td />
                      <td />

                      <td className="Rate">
                        <h2>ราคาทั้งหมด: </h2>
                      </td>
                      <td className="payment">
                        <h2>{selectedBill.subTotal.toLocaleString()}</h2>
                      </td>
                      <td className="Rate">
                        <h2> ฿</h2>
                      </td>
                    </tr>

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>รับเงิน: </h2>
                      </td>
                      <td className="payment">
                        <h2>{selectedBill.change}</h2>
                      </td>
                      <td className="Rate">
                        <h2> ฿</h2>
                      </td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>เงินทอน: </h2>
                      </td>
                      <td className="payment">
                        <h2>{selectedBill.changeAmount}</h2>
                      </td>
                      <td className="Rate">
                        <h2> ฿</h2>
                      </td>
                    </tr>
                    <p>ขอบคุณที่ใช้บริการ</p>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              ปริ้นใบเสร็จ
            </Button>
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default BillPage;
