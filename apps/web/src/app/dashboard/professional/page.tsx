"use client";

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, List } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import StatisticCard from "@ntla9aw/ui/src/components/molecules/StatisticCard";
import EventList from "@ntla9aw/ui/src/components/molecules/EventList";
import MemberCard from "@ntla9aw/ui/src/components/molecules/MemberCard";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";

const { Option } = Select;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
interface Member {
  id: string;
  name: string;
  image: string;
}
export default function ProfessionalDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(() => new Date());

  const { data, isLoading, error, refetch } =
    trpcClient.dashboard.getDashboardStatistics.useQuery(
      { startDate, endDate },
      { enabled: false },
    );

  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - parseInt(value));
    setStartDate(start);
    setEndDate(end);
  };

  if (error)
    return <div>Error loading dashboard statistics: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard title="Total Events" value={data?.totalEvents} />
        </Col>
        <Col span={6}>
          <StatisticCard title="Total Members" value={data?.totalMembers} />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Total Revenue"
            value={data?.totalRevenue}
            prefix="$"
          />
        </Col>
        <Col span={6}>
          <StatisticCard
            title="Total Tickets Sold"
            value={data?.totalTicketsSold}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="Ticket Sales Over Time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.ticketSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Ticket Sales Distribution">
            <Select
              style={{ width: 200, marginBottom: 16 }}
              placeholder="Select time range"
              onChange={handleTimeRangeChange}
              value={selectedTimeRange}
            >
              <Option value="30">Last 30 days</Option>
              <Option value="90">Last 3 months</Option>
              <Option value="180">Last 6 months</Option>
            </Select>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.ticketSalesDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data?.ticketSalesDistribution.map((_, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <EventList events={data?.events} />
        </Col>
        <Col span={12}>
          <Card title="Members">
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={data?.members}
              renderItem={(member: Member) => (
                <List.Item>
                  <MemberCard
                    member={{
                      id: member.id,
                      name: member.name,
                      avatar: member.image,
                    }}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
