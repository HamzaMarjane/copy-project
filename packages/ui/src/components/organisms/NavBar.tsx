"use client";

import React from "react";
import Link from "next/link";
import SearchInput from "../atoms/SearchInput";
import { Brand } from "../atoms/Brand";
import { Button, Menu, Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";
import { DownOutlined } from "@ant-design/icons";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";

// Define the navigation items
const navItems = [
  {
    label: "Book Events",
    key: "book-events",
    href: "/home/featured",
  },
  {
    label: "Create Events",
    key: "create-events",
    href: "/dashboard/events",
  },
];

const authNavItems = [
  {
    label: "Profile",
    key: "profile",
    href: "/home/profile",
  },
];

const unauthNavItems = [
  {
    label: "Login",
    key: "login",
    href: "/auth/signin",
  },
  {
    label: "Signup",
    key: "signup",
    href: "/auth/register",
  },
];

const CustomNavBar: React.FC = () => {
  const { status } = useSession();
  const { data: userRoles } = trpcClient.auth.roles.useQuery();

  const handleSearch = (title: string, location: string) => {
    const titleQueryString = title ? `title=${encodeURIComponent(title)}` : "";
    const cityQueryString = location ? `city=${encodeURIComponent(location)}` : "";

    const queryString = [titleQueryString, cityQueryString]
      .filter(Boolean)
      .join("&");

    if (queryString) {
      window.location.href = `/home/explore?${queryString}`;
    }

    console.log("Searched values:", title, location);
  };

  const getDashboardItems = () => {
    if (!userRoles) return [];

    const items = [];

    if (userRoles.includes('member') || userRoles.includes('individual') || userRoles.includes('organization')) {
      items.push({
        key: 'personal',
        label: <Link href="/dashboard/personal">Personal</Link>,
      });
    }

    if (userRoles.includes('individual') || userRoles.includes('organization')) {
      items.push({
        key: 'professional',
        label: <Link href="/dashboard/professional">Professional</Link>,
      });
    }

    if (userRoles.includes('admin')) {
      items.push({
        key: 'admin',
        label: <Link href="/dashboard/admin">Admin</Link>,
      });
    }

    return items;
  };

  const dashboardMenu = (
    <Menu items={getDashboardItems()} />
  );

  return (
    <Menu
      mode="horizontal"
      style={{
        flex: 1,
        background: "none",
        backgroundColor: "#FEF7FF",
        justifyContent: "space-between",
      }}
    >
      <Menu.Item>
        <Brand />
      </Menu.Item>
      <Menu.Item>
        <SearchInput onSearch={handleSearch} />
      </Menu.Item>
      {navItems.map((item) => (
        <Menu.Item key={item.key}>
          <Link href={item.href}>{item.label}</Link>
        </Menu.Item>
      ))}
      {status === "authenticated" ? (
        <>
          {authNavItems.map((item) => (
            <Menu.Item key={item.key}>
              <Link href={item.href}>{item.label}</Link>
            </Menu.Item>
          ))}
          <Menu.Item key="dashboard">
            <Dropdown overlay={dashboardMenu} trigger={['click']}>
              <a onClick={e => e.preventDefault()}>
                Dashboard <DownOutlined />
              </a>
            </Dropdown>
          </Menu.Item>
          <Menu.Item key="logout">
            <Button type="link" onClick={() => signOut()}>
              Logout
            </Button>
          </Menu.Item>
        </>
      ) : (
        unauthNavItems.map((item) => (
          <Menu.Item key={item.key}>
            <Link href={item.href}>{item.label}</Link>
          </Menu.Item>
        ))
      )}
    </Menu>
  );
};

export default CustomNavBar;