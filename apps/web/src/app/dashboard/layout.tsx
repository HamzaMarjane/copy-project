"use client";
import React, { useState, useEffect } from "react";
import {
  CalendarOutlined,
  FlagOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  DashboardOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, message } from "antd";
import CustomBreadCrumb from "@ntla9aw/ui/src/components/molecules/CustomBreadCrumb";
import CustomNavBar from "@ntla9aw/ui/src/components/organisms/NavBar";
import { usePathname, useRouter } from "next/navigation";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";

const { Header, Sider, Content } = Layout;

const personalNav = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    link: "/dashboard/personal",
  },
  {
    key: "2",
    icon: <CalendarOutlined />,
    label: "Calendar",
    link: "/dashboard/personal/calendar",
  },
  {
    key: "3",
    icon: <SettingOutlined />,
    label: "Settings",
    link: "/dashboard/personal/settings",
  },
];

const professionalNav = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    link: "/dashboard/professional",
  },
  {
    key: "2",
    icon: <FlagOutlined />,
    label: "Event Manager",
    link: "/dashboard/professional/events",
  },
  {
    key: "3",
    icon: <SolutionOutlined />,
    label: "Orders Manager",
    link: "/dashboard/professional/orders",
  },
  {
    key: "4",
    icon: <SettingOutlined />,
    label: "Settings",
    link: "/dashboard/professional/settings",
  },
];

const adminNav = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    link: "/dashboard/admin",
  },
  {
    key: "2",
    icon: <FlagOutlined />,
    label: "Events",
    link: "/dashboard/admin/events",
  },
  {
    key: "3",
    icon: <UserOutlined />,
    label: "Users",
    link: "/dashboard/admin/users",
  },
  {
    key: "4",
    icon: <TeamOutlined />,
    label: "Communities",
    link: "/dashboard/admin/communities",
  },
  {
    key: "5",
    icon: <SettingOutlined />,
    label: "Settings",
    link: "/dashboard/admin/settings",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [navItems, setNavItems] = useState<typeof personalNav>([]);

  const { data: roles, isLoading, error } = trpcClient.auth.roles.useQuery();

  useEffect(() => {
    if (pathname.startsWith("/dashboard/admin")) {
      setNavItems(adminNav);
    } else if (pathname.startsWith("/dashboard/professional")) {
      setNavItems(professionalNav);
    } else if (pathname.startsWith("/dashboard/personal")) {
      setNavItems(personalNav);
    } else {
      // Default to personal nav if path doesn't match any specific dashboard
      setNavItems(personalNav);
    }
  }, [pathname]);

  useEffect(() => {
    const selectedItem = navItems.find((item) => item.link === pathname);
    if (selectedItem) {
      setSelectedKey(selectedItem.key);
    } else {
      setSelectedKey(null);
    }
  }, [pathname, navItems]);

  const handleMenuClick = (e: { key: React.SetStateAction<string | null> }) => {
    const selectedItem = navItems.find((item) => item.key === e.key);
    if (selectedItem) {
      router.push(selectedItem.link);
      setSelectedKey(e.key);
    }
  };

  const isPathAllowed = () => {
    if (!roles) return false;
    if (roles.includes("admin")) return true;
    if (pathname.startsWith("/dashboard/admin") && !roles.includes("admin"))
      return false;
    if (
      pathname.startsWith("/dashboard/professional") &&
      !roles.some((role) => ["individual", "organization"].includes(role))
    )
      return false;
    if (pathname.startsWith("/dashboard/personal") && !roles.includes("member"))
      return false;
    return true;
  };

  useEffect(() => {
    if (!isLoading && !isPathAllowed()) {
      message.error("You don't have access to this area.");
      router.push("/");
    }
  }, [pathname, roles, router, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading user data. Please try again.</div>;
  }

  if (!isPathAllowed()) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#FEF7FF" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FEF7FF",
          padding: 0,
        }}
      >
        <CustomNavBar />
      </Header>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "#FEF7FF", width: 30 }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey || "1"]}
            items={navItems}
            onClick={handleMenuClick}
            style={{ height: "100%", borderRight: 0 }}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#FEF7FF",
            }}
          >
            <Space size={16}>
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
              <CustomBreadCrumb />
            </Space>
          </Header>
          <Content
            style={{
              padding: "1em",
              backgroundColor: "#FFF9D0",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
