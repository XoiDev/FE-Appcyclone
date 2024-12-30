import {
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Col, Layout, Menu, Row, theme } from "antd";
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../../api.ts";
import ButtonCustom from "../../components/button/ButtonCustom.tsx";
import useAuth from "../../hooks/useAuth";
import "./Dashboard.scss";
const { Header, Sider, Content } = Layout;
interface Profile {
  avatar: string;
  email: string;
  exp: number;
  iat: number;
  id: number;
  name: string;
  role: string;
  username: string;
}
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const { handleLogout, token } = useAuth();
  const onLogout = () => {
    handleLogout();
    navigate("/login");
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success("Login successful! 🎉", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [location]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.post("/auth/profile", {});
        setProfile(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <Layout>
      <ToastContainer />
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical " />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <NavLink to="/dashboard/vendors">Vendors</NavLink>,
            },
            {
              key: "2",
              icon: <AppstoreOutlined />,
              label: <NavLink to="/dashboard/categories">Categories</NavLink>,
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: <NavLink to="/dashboard/discount">Discount</NavLink>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row>
            <Col md={19}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Col>
            <Col md={4}>
              <div className="flex items-center justify-center">
                <img
                  src={profile?.avatar}
                  className="w-10 h-10 border rounded-full"
                  alt=""
                />
                <span className="ml-2 text-sm font-bold">{profile?.name}</span>
                <ButtonCustom
                  className="bg-red-400 hover:bg-red-300 "
                  onClick={onLogout}
                  text="logout"
                ></ButtonCustom>
              </div>
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
