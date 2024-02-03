import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, message, Form, Input, Select } from "antd";
import moment from "moment-timezone";

const CartPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [isGenerateBillDisabled, setIsGenerateBillDisabled] = useState(true);
  const [changeAmount, setChangeAmount] = useState(0);
  const [isCashPaymentMode, setIsCashPaymentMode] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const localDateTime = moment

    .utc(moment().tz("Asia/Bangkok").format())
    .tz("Asia/Bangkok");
  //handle increament

  const getAllItems = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/items/get-item");
      const itemWithIndex = data.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
      setItemsData(itemWithIndex);
      dispatch({ type: "HIDE_LOADING" });
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  const handleIncressment = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };
  const handleDecressment = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img
          src={`/images/${image}`}
          alt={record.name}
          height="60"
          width="60"
        />
      ),
    },
    { title: "Price", dataIndex: "price" },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncressment(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecressment(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() => showDeleteConfirmation(record)}
        />
      ),
    },
  ];

  const showDeleteConfirmation = (record) => {
    Swal.fire({
      title: "ต้องการลบหรือไม่ ?",
      text: "กดปุ่ม Cancel เพื่อยกเลิก!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(record);
      }
    });
  };

  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "DELETE_FORM_CART",
        payload: record,
      });
      // Your axios call to delete the item goes here

      Swal.fire({
        title: "Deleted!",
        text: "สินค้าถูกลบแล้ว",
        icon: "success",
      });
      message.success("สินค้าถูกลบแล้ว");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
    let temp = 0;
    cartItems.forEach((item) => (temp = temp + item.price * item.quantity));
    setSubTotal(temp);

    // Enable/disable the "Generate Bill" button based on cartItems
    setIsGenerateBillDisabled(cartItems.length === 0);
  }, [cartItems]);

  //handleSubmit
  const handleSubmit = async (value) => {
    try {
      let newObject = {
        ...value,
        cartItems,
        subTotal,
        changeAmount,
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };

      // ตรวจสอบสินค้าใน stock ก่อนที่จะสร้างบิล
      const itemsInStock = itemsData.filter((item) => {
        const cartItem = cartItems.find(
          (cartItem) => cartItem._id === item._id
        );
        return cartItem && item.stock >= cartItem.quantity;
      });

      // if (itemsInStock.length !== cartItems.length) {
      //   // มีสินค้าในตะกร้าที่มีจำนวนมากกว่าที่มีใน stock
      //   message.error("มีสินค้าในตะกร้าที่มีจำนวนมากกว่าที่มีใน stock");
      //   return;
      // }

      // อัพเดต stock ของสินค้า
      await updateStock(cartItems);

      if (value.paymentMode === "cash") {
        // ตรวจสอบว่าจำนวนเงินสดมากกว่าหรือเท่ากับราคารวมทั้งหมด
        if (parseFloat(value.change) >= subTotal) {
          newObject = {
            ...newObject,
            change: parseFloat(value.change),
          };

          // คำนวณจำนวนเงินทอดคืน
          const changeAmount = parseFloat(value.change) - subTotal;
          setChangeAmount(changeAmount);

          await axios.post("/api/bills/add-bills", newObject);
          dispatch({
            type: "CLEAR_CART",
          });
          message.success("Bill Generated");

          navigate("/bills");
        } else {
          // จำนวนเงินสดไม่เพียงพอ
          message.error("จำนวนเงินสดไม่เพียงพอ");
        }
      } else if (value.paymentMode === "promptpay") {
        // ถ้าไม่ได้เลือก "เงินสด" ให้ลบ property "change" ออกจาก newObject
        //delete newObject.change;
        newObject = {
          ...newObject,
          change: 0,
        };

        await axios.post("/api/bills/add-bills", newObject);
        dispatch({
          type: "CLEAR_CART",
        });
        message.success("Bill Generated");
        navigate("/bills");
      }
    } catch (error) {
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  const updateStock = async (cartItems) => {
    try {
      const updatedItems = await Promise.all(
        cartItems.map(async (item) => {
          const { _id, quantity } = item;
          const itemData = itemsData.find((data) => data._id === _id);
          const updatedStock = itemData.stock - quantity;

          // ส่ง request ไปยัง API สำหรับการอัพเดต stock ของสินค้า
          await axios.put(`/api/items/edit-item/${_id}`, {
            stock: updatedStock,
          });

          // สร้างอ็อบเจ็กต์ใหม่ที่มีจำนวนสินค้าในตะกร้าล่าสุด
          return {
            ...itemData,
            stock: updatedStock,
          };
        })
      );

      // อัพเดต state ของ itemsData เพื่อแสดงจำนวนสินค้าใหม่
      setItemsData(updatedItems);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const handleInvoiceCreation = async () => {
    if (cartItems.length === 0) {
      // If cart is empty, show SweetAlert warning
      Swal.fire({
        title: "ตะกร้าสินค้าว่างเปล่า!",
        text: "กรุณาเพิ่มสินค้า",
        icon: "warning",
      });
    } else {
      // If cart is not empty, proceed with invoice creation
      setBillPopup(true);
    }
  };

  return (
    <DefaultLayout>
      <h1>Cart Page</h1>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h3>
          Subt Total : <b> {subTotal.toLocaleString()} </b> ฿{" "}
        </h3>
        <Button type="primary" onClick={handleInvoiceCreation}>
          Create Invoice
        </Button>
      </div>
      <Modal
        title="Create Invoice"
        visible={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="paymentMode" label="Payment Method">
            <Select
              onChange={(value) => setIsCashPaymentMode(value === "cash")}
            >
              <Select.Option value="cash">เงินสด</Select.Option>
              <Select.Option value="promptpay">โอน</Select.Option>
            </Select>
          </Form.Item>
          {/* ใช้ isCashPaymentMode เพื่อตรวจสอบการแสดงหรือซ่อน input */}
          {isCashPaymentMode && (
            <Form.Item name="change" label="รับเงิน">
              <Input
                onChange={(e) => {
                  const receivedAmount = parseFloat(e.target.value);
                  const change = receivedAmount - subTotal;
                  setChangeAmount(change);
                }}
              />
            </Form.Item>
          )}
          <div className="bill-it">
            <h5>
              Total : <b>{subTotal.toLocaleString()}</b>
            </h5>
            {changeAmount > 0 && (
              <h5>
                Change : <b>{changeAmount.toLocaleString()}</b>
              </h5>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
