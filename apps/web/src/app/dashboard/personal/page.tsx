"use client";

import React from "react";
import { Card, Row, Col, List, Avatar, Tag } from "antd";

// Static data for member role
const memberData = {
  communities: [
    {
      id: 1,
      name: "Tech Enthusiasts",
      image: "/placeholder.svg?height=32&width=32",
      members: 150,
    },
    {
      id: 2,
      name: "Local Foodies",
      image: "/placeholder.svg?height=32&width=32",
      members: 75,
    },
    {
      id: 3,
      name: "Fitness Fanatics",
      image: "/placeholder.svg?height=32&width=32",
      members: 200,
    },
  ],
  events: [
    { id: 1, title: "Tech Meetup", date: "2024-04-15" },
    { id: 2, title: "Food Festival", date: "2024-05-01" },
    { id: 3, title: "Marathon Training", date: "2024-04-22" },
  ],
  tags: ["Technology", "Food", "Fitness", "Networking", "Outdoors"],
};

export default function Page() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card title="My Communities" className="h-full">
          <List
            itemLayout="horizontal"
            dataSource={memberData.communities}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.image} />}
                  title={item.name}
                  description={`${item.members} members`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Upcoming Events" className="h-full">
          <List
            itemLayout="horizontal"
            dataSource={memberData.events}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={new Date(item.date).toLocaleDateString()}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="My Tags" className="h-full">
          {memberData.tags.map((tag) => (
            <Tag key={tag} color="blue" className="mb-2">
              {tag}
            </Tag>
          ))}
        </Card>
      </Col>
    </Row>
  );
}
