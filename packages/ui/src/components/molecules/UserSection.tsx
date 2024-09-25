import React from 'react'
import { Row, Col, Card, Spin } from 'antd'
import { trpcClient } from '@ntla9aw/trpc-client/src/client'
import StatisticCard from './StatisticCard'
import LineChart from './LineChart'
import DonutChart from './DonutChart'

const UserSection: React.FC = () => {
  const { data, isLoading, error } = trpcClient.statistic.getUserStatistics.useQuery({})
  

  if (isLoading) return <Spin size="large" />
  if (error) return <div>Error loading user statistics</div>

  const userGrowthData = data?.userGrowth.map(ug => ({
    name: new Date(ug.month).toLocaleString('default', { month: 'short' }),
    value: ug.count
  })) || []

  const userTypeData = data?.userTypes ? [
    { name: 'Members', value: data.userTypes.members },
    { name: 'Individuals', value: data.userTypes.individuals },
    { name: 'Organizations', value: data.userTypes.organizations }
  ] : []
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard title="Total Users" value={data?.totalUsers || 0} />
        </Col>
        <Col span={6}>
          <StatisticCard title="New Users (This Month)" value={data?.newUsers || 0} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="User Growth">
            <LineChart data={userGrowthData} xDataKey="name" yDataKey="value" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="User Types">
            <DonutChart data={userTypeData} />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default UserSection