import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import LayoutAdmin from "./components/LayoutAdmin";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Table, Modal, Button } from "antd";

const User = () => {
  const [usersData, setUsersData] = useState([]);
  const dispatch = useDispatch();
  const [popupModal, setPopupModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [editUsers, setEditUsers] = useState(null);

  const getAllUsers = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("/api/users/get-users");
      setUsersData(data);
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

  const handleDelete = async (record) => {};

  const columns = [
    { title: "ID", dataIndex: "_id" },
    { title: "UserID", dataIndex: "UserId" },
    // { title: "password", dataIndex: "password" },
    { title: "Name", dataIndex: "name" },
    { title: "Roles", dataIndex: "roles" },
    {
      title: "Actions",
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

  return (
    <LayoutAdmin>
      <main className="main-container">
        <div className="main-title">
          <h3>User List</h3>
        </div>
        <Table columns={columns} dataSource={usersData} bordered />
      </main>
    </LayoutAdmin>
  );
};

export default User;
