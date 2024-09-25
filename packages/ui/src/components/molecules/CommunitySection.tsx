import React from 'react'
import { Row, Col, Card, Spin } from 'antd'
import { trpcClient } from '@ntla9aw/trpc-client/src/client'
import StatisticCard from './StatisticCard'
import LineChart from './LineChart'

const CommunitySection: React.FC = () => {
  const { data, isLoading, error } = 
    trpcClient.statistic.getCommunityStatistics.useQuery()


  if (isLoading) return <Spin size="large" />
  if (error) return <div>Error loading community statistics</div>

  const communityGrowthData = data?.communityGrowth.map(cg => ({
    name: new Date(cg.month).toLocaleString('default', { month: 'short' }),
    value: cg.count
  })) || []

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCard title="Total Communities" value={data?.totalCommunities || 0} />
        </Col>
        <Col span={6}>
          <StatisticCard title="New Communities (This Month)" value={data?.newCommunities || 0} />
        </Col>
        <Col span={6}>
          <StatisticCard title="Average Members" value={Math.round(data?.averageMembers || 0)} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Community Growth">
            <LineChart data={communityGrowthData} xDataKey="name" yDataKey="value" color="#ffc658" />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CommunitySection