import React from "react";
import { Button, Card, message } from "antd";
import { useDispatch } from "react-redux";
const ItemList = ({ item }) => {
  const dispatch = useDispatch();
  //update cart handle
  const handleAddTOCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity: 1 },
    });
    message.success("สินค้าได้ถูกเพิ่มแล้ว");
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
          <Button onClick={() => handleAddTOCart()}>Add to Cart</Button>
        </div>
      </Card>
    </div>
  );
};

export default ItemList;
