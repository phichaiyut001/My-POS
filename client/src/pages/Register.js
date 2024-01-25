import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post("/api/users/register", value);
      message.success("Register SuccessFully");
      navigate("/login");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("UserId already to use");
      console.log(error);
    }
  };

  //currently login user
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="register ">
        <div className="register-from">
          <h1>POS App</h1>
          <h3>Register Page</h3>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "กรุณากรอก ชื่อ" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="UserId"
              label="User ID"
              rules={[{ required: true, message: "กรุณากรอก UserId" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "กรุณากรอก รหัสผ่าน" }]}
            >
              <Input type="password" />
            </Form.Item>
            <div className="d-flex justify-content-between">
              <p>
                Already Register Plese
                <Link to="/login"> Login Here !</Link>
              </p>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
