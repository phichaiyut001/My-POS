import React, { useState, useEffect, useRef } from "react";
import LayoutAdmin from "./components/LayoutAdmin";
import { useDispatch } from "react-redux";
import axios from "axios";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table, Modal, Button, message } from "antd";
import "./components/AdminInvoice.css";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

const Bills = () => {
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
      const billsWithIndex = data.map((bill, index) => ({
        ...bill,
        index: index + 1,
      }));

      setBillsData(billsWithIndex);
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

  const handleDelete = async (record) => {
    try {
      const swalResult = await Swal.fire({
        title: "ต้องการที่จะลบหรือไม่ ?",
        text: "กด Cancel เพื่อยกเลิก !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (swalResult.isConfirmed) {
        dispatch({
          type: "SHOW_LOADING",
        });

        await axios.post("/api/bills/delete-bills", { billsid: record._id });

        Swal.fire({
          title: "Deleted!",
          text: "บิลถูกลบแล้ว",
          icon: "success",
        });

        message.success("Bills Deleted Successfully");
        getAllBills();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      }
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      width: 30,
    },
    { title: "ID", dataIndex: "_id" },
    {
      title: "สินค้า",
      dataIndex: "cartItems",
      render: (cartItems) => (
        <ul style={{ listStyle: "square" }}>
          {cartItems.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      ),
    },
    { title: "วิธีการจ่าย", dataIndex: "paymentMode" },
    { title: "ราคาทั้งหมด", dataIndex: "subTotal" },
    { title: "รับเงิน", dataIndex: "change" },
    { title: "เงินทอน", dataIndex: "changeAmount" },
    {
      title: "วันที่",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date), // เรียงลำดับตามวันที่
      render: (date) => formatDate(date), // เรียกใช้ฟังก์ชัน formatDate
    },

    {
      title: "Actions",
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
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };
  const cancel = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <LayoutAdmin>
      <main className="main-container">
        <div className="d-flex justify-content-between">
          <h1>Invoice list</h1>
        </div>
        <Table columns={columns} dataSource={billsData} bordered />

        {popupModal && (
          <Modal
            width={400}
            pagination={false}
            title="Invoice Details"
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
                    Date : <b>{formatDate(selectedBill.date)}</b>
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
                          <h2>Item</h2>
                        </td>
                        <td className="Hours">
                          <h2>Qty</h2>
                        </td>

                        <td className="Rate">
                          <h2>Price</h2>
                        </td>
                        <td className="Rate">
                          <h2>Total</h2>
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
                          <h2>Total Amount: </h2>
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
                Print this out!
              </Button>
            </div>
          </Modal>
        )}
      </main>
    </LayoutAdmin>
  );
};

export default Bills;
