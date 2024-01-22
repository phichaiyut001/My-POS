import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await axios.post("/api/users/login", value);
      message.success("User Logged In Succesfully");
      // Storing the user details in localStorage -> we can use sessions and cookies otherwise

      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
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
          <h3>Login Page</h3>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="UserId"
              label="User ID"
              rules={[{ required: true, message: "กรุณากรอก Username" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "กรุณากรอก Password" }]}
            >
              <Input type="password" />
            </Form.Item>
            <div className="d-flex justify-content-between">
              <p>
                Not a user Please
                <Link to="/register"> Register Here !</Link>
              </p>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
