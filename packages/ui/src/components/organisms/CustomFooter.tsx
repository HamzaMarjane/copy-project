import React from "react";
import {
  Layout,
  Input,
  Menu,
  Row,
  Col,
  List,
  Space,
  Typography,
  Divider,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import CustomButton from "../atoms/Button"; // Adjust the import path as necessary
import { Brand } from "../atoms/Brand";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

interface SubscriptionTerm {
  id: number;
  description: string;
}

interface Subscription {
  terms: SubscriptionTerm[];
}

interface CustomFooterProps {
  subscription: Subscription;
  copyright: { key: string; href: string; label: string }[];
  socials: { key: string; href: string; label: string }[];
}

const CustomFooter: React.FC<CustomFooterProps> = ({ subscription, copyright, socials }) => {
  return (
    <Layout.Footer style={{ padding: "40px 0", backgroundColor: "#FFF9D0" }}>
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>Subscription Terms</Title>
            <List
              dataSource={subscription.terms}
              renderItem={(item) => (
                <List.Item key={item.id} style={{ border: "none", padding: "4px 0" }}>
                  <Text style={{ fontSize: 14 }}>{item.description}</Text>
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>Additional Information</Title>
            <List
              dataSource={subscription.terms}
              renderItem={(item) => (
                <List.Item key={item.id} style={{ border: "none", padding: "4px 0" }}>
                  <Text style={{ fontSize: 14 }}>{item.description}</Text>
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>Help & Support</Title>
            <List
              dataSource={subscription.terms}
              renderItem={(item) => (
                <List.Item key={item.id} style={{ border: "none", padding: "4px 0" }}>
                  <Text style={{ fontSize: 14 }}>{item.description}</Text>
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space direction="vertical" style={{ width: "100%", padding: 24, backgroundColor: "#F1F6FD", borderRadius: 8 }}>
              <Title level={5} style={{ marginBottom: 16 }}>Subscribe</Title>
              <Input
                placeholder="Enter your email"
                suffix={<SendOutlined style={{ color: "#5AB2FF" }} />}
                style={{ marginBottom: 16 }}
              />
              <CustomButton
                label="Subscribe"
                onClick={() => console.log("Subscribed")}
                style={{
                  backgroundColor: "#5AB2FF",
                  borderColor: "#5AB2FF",
                  width: "100%",
                }}
              />
              <Paragraph style={{ fontSize: 12, marginTop: 8 }}>
                By subscribing you allow ntla9aw to send you messages
              </Paragraph>
            </Space>
          </Col>
        </Row>

        <Divider style={{ margin: "32px 0" }} />

        <Row align="middle" justify="space-between">
          <Col xs={24} sm={8}>
            <Brand />
          </Col>
          <Col xs={24} sm={8}>
            <Menu mode="horizontal" style={{ backgroundColor: "transparent", justifyContent: "center", border: "none" }}>
              {copyright.map((item) => (
                <Menu.Item key={item.key} style={{ padding: "0 8px" }}>
                  <Link href={item.href}>
                    <Text style={{ fontSize: 14 }}>{item.label}</Text>
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          </Col>
          <Col xs={24} sm={8}>
            <Menu mode="horizontal" style={{ backgroundColor: "transparent", justifyContent: "flex-end", border: "none" }}>
              {socials.map((item) => (
                <Menu.Item key={item.key} style={{ padding: "0 8px" }}>
                  <Link href={item.href}>
                    <Text style={{ fontSize: 14 }}>{item.label}</Text>
                  </Link>
                </Menu.Item>
              ))}
            </Menu>
          </Col>
        </Row>
      </div>
    </Layout.Footer>
  );
};

export default CustomFooter;