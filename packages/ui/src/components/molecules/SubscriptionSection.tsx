import React from 'react'
import { Row, Col, Card, Spin } from 'antd'
import { trpcClient } from '@ntla9aw/trpc-client/src/client'
import StatisticCard from './StatisticCard'
import LineChart from './LineChart'
import DonutChart from './DonutChart'

const SubscriptionSection: React.FC = () => {
  const { data, isLoading, error } = 
    trpcClient.statistic.getSubscriptionStatistics.useQuery()

  if (isLoading) return <Spin size="large" />
  if (error) return <div>Error loading subscription statistics</div>

  const revenueData = data?.revenueGrowth.map(rg => ({
    name: new Date(rg.month).toLocaleString('default', { month: 'short' }),
    value: rg.total
  })) || []

  const subscriptionTypeData = data?.subscriptionTypes.map(st => ({
    name: st.currency,
    value: st._count
  })) || []

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard title="Total Subscribers" value={data?.totalSubscribers || 0} />
        </Col>
        <Col span={6}>
          <StatisticCard title="Monthly Revenue" value={data?.monthlyRevenue || 0} prefix="$" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Revenue Growth">
            <LineChart data={revenueData} xDataKey="name" yDataKey="value" color="#8884d8" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Subscription Types">
            <DonutChart data={subscriptionTypeData} />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SubscriptionSection