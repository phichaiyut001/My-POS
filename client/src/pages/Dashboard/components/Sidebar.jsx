import { Link, useNavigate } from "react-router-dom";
import { message, Menu } from "antd";
import React from "react";
import Swal from "sweetalert2";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
} from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const showLogoutConfirmation = () => {
    Swal.fire({
      title: "Logout",
      text: "ต้องการที่จะออกจากระบบหรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    message.warning("Logged out successfully");
    navigate("/login");
  };
  const navigate = useNavigate();
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> POS ข้าวปลาทอด
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>
      <Menu
        theme={"dark"}
        mode="inline"
        defaultSelectedKeys={window.location.pathname}
      >
        <Menu.Item key="/Dashboard" icon={<BsGrid1X2Fill />}>
          <Link to="/Dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/inventory" icon={<BsListCheck />}>
          <Link to="/inventory">Inventory</Link>
        </Menu.Item>
        <Menu.Item key="/Billsadmin" icon={<BsFillArchiveFill />}>
          <Link to="/Billsadmin">Bills</Link>
        </Menu.Item>
        <Menu.Item key="/userlist" icon={<BsPeopleFill />}>
          <Link to="/userlist">User</Link>
        </Menu.Item>
        <Menu.Item
          key="/logout"
          icon={<IoIosLogOut />}
          onClick={() => showLogoutConfirmation()}
        >
          Logout
        </Menu.Item>
      </Menu>
      {/* <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/dashboard">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/inventory">
            <BsListCheck className="icon" /> Inventory
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/Billsadmin">
            <BsFillArchiveFill className="icon" /> Bills
          </Link>
        </li>
        {/* <li className="sidebar-list-item">
          <Link to="/categories">
            <BsFillGrid3X3GapFill className="icon" /> Categories
          </Link>
        </li> 
        <li className="sidebar-list-item">
          <Link to="/User">
            <BsPeopleFill className="icon" /> User
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/reports">
            <BsMenuButtonWideFill className="icon" /> Reports
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link
            to="/login"
            onClick={() => {
              message.warning("ออกจากระบบสำเร็จ");
              localStorage.removeItem("auth");
            }}
          >
            <IoIosLogOut className="icon" /> Logout
          </Link>
        </li>
      </ul> */}
    </aside>
  );
}

export default Sidebar;
