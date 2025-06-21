import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Building,
  HomeIcon,
  LogOutIcon,
  Route,
  Search,
  ShoppingBag,
  Train,
} from "lucide-react";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const selectedKey = location.pathname;

  const items = [
    {
      key: "/home",
      icon: <HomeIcon size={20} />,
      label: <Link to="/home">Bosh sahifa</Link>,
    },
    {
      key: "/search",
      icon: <Search size={20} />,
      label: <Link to="/search">Qidiruv</Link>,
    },
    {
      key: "/vagons",
      icon: <ShoppingBag size={20} />,
      label: <Link to="/vagons">Vagonlar ombori</Link>,
    },
    {
      key: "/stations",
      icon: <Building size={20} />,
      label: <Link to="/stations">Stantsiyalar</Link>,
    },
    {
      key: "/route",
      icon: <Route size={20} />,
      label: <Link to="/route">Yo'nalish</Link>,
    },
    {
      key: "/train",
      icon: <Train size={20} />,
      label: <Link to="/train">Harakat tarkibi</Link>,
    },
    {
      key: "/logout",
      icon: <LogOutIcon size={20} />,
      label: (
        <Link
          to="/"
          onClick={() => {
            localStorage.removeItem("token");
          }}
        >
          Chiqish
        </Link>
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider collapsible>
        <div
          className="logo"
          style={{
            margin: 16,
            color: "white",
            textAlign: "center",
          }}
        >
          Admin
        </div>
        <hr />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <p>Boshqaruv Paneli</p>
            </div>
          </h2>
        </Header>
        <Content style={{ margin: "16px", overflow: "scroll" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
