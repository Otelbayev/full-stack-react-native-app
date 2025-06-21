import { Form, Input, Button, Typography, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg1.jpg";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/login`,
      values
    );

    if (res.status === 200) {
      navigate("/home");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      ></div>
      <Card style={{ width: 350, padding: 20, zIndex: 2 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Tizimga kirish
        </Title>
        <Form
          name="login_form"
          initialValues={{ remember: true, username: "admin", password: "123" }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Login"
            rules={[
              {
                required: true,
                message: "Iltimos, foydalanuvchi login kiriting!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Foydalanuvchi nomi" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: "Iltimos, parolni kiriting!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Parol" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
