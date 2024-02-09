import React, { useState } from "react";
import { Button, Card, message, Modal, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";

const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (item.stock > 0) {
      setVisible(true);
    } else {
      message.error("สินค้าหมด");
    }
  };

  const handleOk = () => {
    if (quantity <= item.stock) {
      const existingCartItem = cartItems.find(
        (cartItem) => cartItem._id === item._id
      );
      if (existingCartItem) {
        dispatch({
          type: "UPDATE_CART",
          payload: {
            _id: item._id,
            quantity: existingCartItem.quantity + quantity,
          },
        });
        message.warning("จำนวนสินค้าได้ถูกเพิ่มแล้ว");
      } else {
        dispatch({
          type: "ADD_TO_CART",
          payload: { ...item, quantity },
        });
        message.success("สินค้าได้ถูกเพิ่มแล้ว");
      }
      setVisible(false);
    } else {
      message.error(`คุณสามารถกรอกจำนวนสินค้าได้ไม่เกิน ${item.stock} ชิ้น`);
    }
  };

  const handleCancel = () => {
    setVisible(false);
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
        <h1 style={{ fontSize: 16 }}>{item.stock} ชิ้น</h1>
        <h2 style={{ fontSize: 30 }}>{item.price.toLocaleString()} ฿</h2>
        <div className="item-button">
          <Button
            onClick={handleAddToCart}
            style={{
              backgroundColor: item.stock > 0 ? "green" : "red",
              color: "white",
            }}
            disabled={item.stock === 0}
          >
            {item.stock > 0 ? "เพิ่มลงตะกร้า" : "สินค้าหมด"}
          </Button>
        </div>
      </Card>
      <Modal
        title="เพิ่มสินค้าลงในตะกร้า"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <InputNumber
          min={1}
          max={item.stock}
          defaultValue={1}
          onChange={(value) => setQuantity(value)}
        />
      </Modal>
    </div>
  );
};

export default ItemList;
