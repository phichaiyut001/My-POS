import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch } from "react-redux";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";

const ItemPage = () => {
  const [file, setFile] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const dispatch = useDispatch();
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  //useEffect
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

  useEffect(() => {
    getAllItems();
  }, []);

  //handle delete

  const handleDelete = async (record) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("/api/items/delete-item", { itemId: record._id });
      message.success("Item Deleted SuccessFully");
      getAllItems();
      setPopupModal(false);
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Someting Went Wrong");
      console.log(error);
    }
  };

  //able data
  const columns = [
    {
      title: "No",
      dataIndex: "index",
      width: 10,
    },
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
    { title: "Stock", dataIndex: "stock" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setFile(null);
              setPopupModal(true);
            }}
          />
          {/* <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record);
            }}
          /> */}
        </div>
      ),
    },
  ];

  // handle submit
  const handleSubmit = async (value) => {
    const formData = new FormData();
    formData.append("name", value.name);
    formData.append("price", value.price);
    formData.append("stock", value.stock);
    formData.append("category", value.category);
    if (file) {
      formData.append("image", file);
    }

    try {
      dispatch({
        type: "SHOW_LOADING",
      });

      if (editItem === null) {
        // Add Item
        await axios.post("/api/items/add-item", formData);
        message.success("Item Added Successfully");
      } else {
        // Update Item using PUT request
        await axios.put(`/api/items/edit-item/${editItem._id}`, formData);
        message.success("Item Update Successfully");
      }

      getAllItems();
      setPopupModal(false);
      dispatch({
        type: "HIDE_LOADING",
      });
    } catch (error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Item List</h1>
        {/* <Button type="primary" onClick={() => setPopupModal(true)}>
          Add Item
        </Button> */}
      </div>
      <Table columns={columns} dataSource={itemsData} bordered />

      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item " : "Add New Item"}`}
          open={popupModal}
          onCancel={() => {
            setEditItem(null);
            setPopupModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "กรุณากรอก ชื่อสินค้า" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "กรุณากรอก ราคาสินค้า" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="stock"
              label="stock"
              rules={[{ required: true, message: "กรุณากรอก จำนวนสินค้า" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="image"
              label="Image"
              rules={[{ required: true, message: "กรุณาใส่รูปสินค้า" }]}
            >
              {editItem && editItem.image && (
                <div>
                  <img
                    src={`/images/${editItem.image}`} // Assuming the 'image' field contains the URL of the existing image
                    alt="Current Item Image"
                    style={{ maxWidth: "100px", marginBottom: "10px" }}
                  />
                </div>
              )}
              <Input type="file" onChange={handleFileChange} />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "กรุณาเลือกประเภท สินค้า" }]}
            >
              <Select>
                <Select.Option value="drinks">Drinks</Select.Option>
                <Select.Option value="rice">Rice</Select.Option>
                <Select.Option value="fish">Fish</Select.Option>
                <Select.Option value="etc">Snack</Select.Option>
                <Select.Option value="chili">Chilli</Select.Option>
              </Select>
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default ItemPage;
