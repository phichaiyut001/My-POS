import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LayoutAdmin from "./components/LayoutAdmin";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const User = () => {
  const [usersData, setUsersData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [popupModal, setPopupModal] = useState(false);
  const [editUsers, setEditUsers] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      console.log(data);
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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

        await axios.post("/api/users/delete-users", { UserId: record._id });

        Swal.fire({
          title: "Deleted!",
          text: "ผู้ใช้งานถูกลบแล้ว",
          icon: "success",
        });

        message.success("Item Deleted SuccessFully");
        getAllUsers();
        setPopupModal(false);
        dispatch({ type: "HIDE_LOADING" });
      }
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Someting Went Wrong");
      console.log(error);
    }
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      width: 30,
    },
    { title: "ไอดีผู้ใช้งาน", dataIndex: "UserId" },
    // { title: "password", dataIndex: "password" },
    { title: "ชื่อ", dataIndex: "name" },
    { title: "ตำแหน่ง", dataIndex: "roles" },
    {
      title: "",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditUsers(record);
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

  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });

      const requestData = {
        name: value.name,
        UserId: value.UserId,
        roles: value.roles,
      };

      // Check if password is provided
      if (value.password) {
        requestData.password = value.password;
      }

      if (editUsers === null) {
        // Add Item
        await axios.post("/api/users/register", requestData);
        message.success("Register SuccessFully");
      } else {
        // Update Item using PUT request
        await axios.put(`/api/users/edit-users/${editUsers._id}`, requestData);
        message.success("Users Update Successfully");
      }
      setPopupModal(false);
      getAllUsers();
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("UserId already to use");
      console.log(error);
    }
  };

  return (
    <LayoutAdmin>
      <main className="main-container">
        <div className="main-title">
          <h1>สมาชิกผู้ใช้งาน</h1>
          <Button type="primary" onClick={() => setPopupModal(true)}>
            เพิ่มผู้ใช้งาน
          </Button>
        </div>
        <Table columns={columns} dataSource={usersData} bordered />

        {popupModal && (
          <Modal
            title={`${
              editUsers !== null ? "แก้ไขข้อมูลผู้ใช้งาน " : "เพิ่มผู้ใช้งาน"
            }`}
            open={popupModal}
            onCancel={() => {
              setEditUsers(null);
              setPopupModal(false);
            }}
            footer={false}
          >
            <Form
              layout="vertical"
              initialValues={{
                ...editUsers,
                password: editUsers ? "" : undefined, // Set password to an empty string if editing, otherwise undefined
              }}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="name"
                label="ชื่อ"
                rules={[{ required: true, message: "กรุณากรอก ชื่อ" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="UserId"
                label="ไอดี"
                rules={[{ required: true, message: "กรุณากรอก UserId" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="รหัสผ่าน"
                rules={[
                  { required: !editUsers, message: "กรุณากรอก รหัสผ่าน" },
                ]}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  suffix={
                    <EyeOutlined
                      style={{ cursor: "pointer" }}
                      onClick={handleTogglePassword}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                name="roles"
                label="ตำแหน่ง"
                rules={[{ required: true, message: "กรุณาเลือกประเภท สินค้า" }]}
              >
                <Select>
                  <Select.Option value="user">User</Select.Option>
                  {/* <Select.Option value="admin">Admin</Select.Option> */}
                </Select>
              </Form.Item>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Form>
          </Modal>
        )}
      </main>
    </LayoutAdmin>
  );
};

export default User;
