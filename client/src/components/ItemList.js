// components/ItemList.js
import React from "react";
import { Button, Card, message } from "antd";
import { useDispatch, useSelector } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer); // ตรวจสอบว่า state.rootReducer.cartItems มีค่าหรือไม่

  const handleAddToCart = () => {
    const existingCartItem = cartItems.find(
      (cartItem) => cartItem._id === item._id // ตรวจสอบว่า item._id มีค่าหรือไม่
    );
    if (existingCartItem) {
      // Item already exists in the cart, update the quantity
      dispatch({
        type: "UPDATE_CART",
        payload: { _id: item._id, quantity: existingCartItem.quantity + 1 },
      });
      message.warning("จำนวนสินค้าได้ถูกเพิ่มแล้ว");
    } else {
      // Item doesn't exist in the cart, add it
      dispatch({
        type: "ADD_TO_CART",
        payload: { ...item, quantity: 1 },
      });
      message.success("สินค้าได้ถูกเพิ่มแล้ว");
    }

    // แจ้งเตือนถ้าสินค้าถูกเพิ่ม
  };

  const { Meta } = Card;

  return (
    <div>
      <Card
        style={{ width: 300, margin: 20 }}
        cover={
          <img
            alt={item.name}
            src={`/images/${item.image}`}
            style={{ height: 200 }}
          />
        }
      >
        <Meta title={item.name} />
        <h2 style={{ fontSize: 30 }}>{item.price.toLocaleString()} ฿</h2>
        <div className="item-button">
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
