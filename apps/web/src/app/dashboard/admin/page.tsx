"use client";

import React from "react";
import { Layout, Typography, Row, Col } from "antd";
import UserSection from "@ntla9aw/ui/src/components/molecules/UserSection";
import EventSection from "@ntla9aw/ui/src/components/molecules/EventSection";
import CommunitySection from "@ntla9aw/ui/src/components/molecules/CommunitySection";
import SubscriptionSection from "@ntla9aw/ui/src/components/molecules/SubscriptionSection";

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px" }}>
        <Title level={2}>Admin Dashboard</Title>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <UserSection />
          </Col>
          <Col span={24}>
            <EventSection />
          </Col>
          <Col span={24}>
            <CommunitySection />
          </Col>
          <Col span={24}>
            <SubscriptionSection />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
