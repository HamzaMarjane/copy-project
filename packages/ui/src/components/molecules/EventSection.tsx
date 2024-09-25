import React from 'react'
import { Row, Col, Card, Spin } from 'antd'
import { trpcClient } from '@ntla9aw/trpc-client/src/client'
import StatisticCard from './StatisticCard'
import LineChart from './LineChart'
import DonutChart from './DonutChart'

const EventSection: React.FC = () => {
  const { data, isLoading, error } = 
    trpcClient.statistic.getEventStatistics.useQuery()

  if (isLoading) return <Spin size="large" />
  if (error) return <div>Error loading event statistics</div>

  const eventGrowthData = data?.eventGrowth.map(eg => ({
    name: new Date(eg.month).toLocaleString('default', { month: 'short' }),
    value: eg.count
  })) || []

  const eventTypeData = data?.eventTypes.map(et => ({
    name: et.type,
    value: et._count
  })) || []

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard title="Total Events" value={data?.totalEvents || 0} />
        </Col>
        <Col span={6}>
          <StatisticCard title="Upcoming Events" value={data?.upcomingEvents || 0} />
        </Col>
        <Col span={6}>
          <StatisticCard title="Past Events" value={data?.pastEvents || 0} />
        </Col>
        <Col span={6}>
          <StatisticCard title="Average Attendees" value={Math.round(data?.averageAttendees || 0)} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Event Growth">
            <LineChart data={eventGrowthData} xDataKey="name" yDataKey="value" color="#82ca9d" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Event Types">
            <DonutChart data={eventTypeData} />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default EventSection