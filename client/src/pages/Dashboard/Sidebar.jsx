import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout, Menu, message } from "antd";
import React, { useEffect, useState } from "react";

import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
function Sidebar({ openSidebarToggle, OpenSidebar }) {
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

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/dashboard">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/products">
            <BsFillArchiveFill className="icon" /> Products
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/categories">
            <BsFillGrid3X3GapFill className="icon" /> Categories
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/customers">
            <BsPeopleFill className="icon" /> Customers
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link to="/inventory">
            <BsListCheck className="icon" /> Inventory
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
      </ul>
    </aside>
  );
}

export default Sidebar;
