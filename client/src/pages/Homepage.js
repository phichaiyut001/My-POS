import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { Col, Row } from "antd";
import ItemList from "../components/ItemList";
import { useDispatch } from "react-redux";

const Homepage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [selectCategory, setSelectCategory] = useState("rice");
  const categories = [
    {
      name: "rice",
      fname: "ข้าว",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/1531/1531385.png",
    },
    {
      name: "drinks",
      fname: "เครื่องดื่ม",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/878/878060.png",
    },
    {
      name: "fish",
      fname: "ปลาทอด",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075494.png",
    },
    {
      name: "etc",
      fname: "ของทอด",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075494.png",
    },
    {
      name: "chili",
      fname: "น้ำพริก",
      imageUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075494.png",
    },
  ];
  const dispatch = useDispatch();
  //useEffect
  useEffect(() => {
    const getAllItems = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get("/api/items/get-item");
        setItemsData(data);
        dispatch({ type: "HIDE_LOADING" });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllItems();
  }, [dispatch]);
  return (
    <DefaultLayout>
      <div className="d-flex ">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`d-flex category ${
              selectCategory === category.name && "category-active"
            }`}
            onClick={() => setSelectCategory(category.name)}
          >
            <h4>{category.fname}</h4>
            <img
              src={category.imageUrl}
              alt={category.name}
              height="40"
              width="60"
            />
          </div>
        ))}
      </div>
      <Row>
        {itemsData
          .filter((i) => i.category === selectCategory)
          .map((item) => (
            <Col xs={24} lg={6} md={12} sm={6}>
              <ItemList key={item.id} item={item} />
            </Col>
          ))}
      </Row>
    </DefaultLayout>
  );
};

export default Homepage;
