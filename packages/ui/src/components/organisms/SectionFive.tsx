import React from "react";
import { Col, Row, Typography, Card, List, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface SubscriptionTerm {
  id: number;
  description: string;
}

interface Subscription {
  name: string;
  terms: SubscriptionTerm[];
  price: string;
}

interface SectionFiveProps {
  subscriptions: Subscription[];
}

const SectionFive: React.FC<SectionFiveProps> = ({ subscriptions }) => {
  return (
    <div style={{ padding: "40px 0", background: "#f0f2f5" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 40 }}>
        Subscription Plans
        <div
          style={{
            margin: "10px auto",
            width: 100,
            height: 4,
            background: "#FFF9D0",
            borderRadius: 2,
          }}
        />
      </Title>
      <Row gutter={[24, 24]} justify="center">
        {subscriptions.map((subscription, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#1890ff",
                borderRadius: 8,
              }}
              bodyStyle={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Title level={3} style={{ color: "white", textAlign: "center" }}>
                  {subscription.name}
                </Title>
                <Title level={2} style={{ color: "white", textAlign: "center", marginTop: 0 }}>
                  {subscription.price}
                </Title>
                <List
                  dataSource={subscription.terms}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id}
                      style={{ border: "none", padding: "8px 0", color: "white" }}
                    >
                      <CheckOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                      {item.description}
                    </List.Item>
                  )}
                />
              </div>
              <Button
                type="primary"
                size="large"
                style={{
                  marginTop: 20,
                  background: "white",
                  borderColor: "white",
                  color: "#1890ff",
                }}
                onClick={() => console.log(`Subscribed to ${subscription.name}`)}
              >
                Subscribe Now
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SectionFive;