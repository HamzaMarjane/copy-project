import React from 'react'
import { Card, Statistic } from 'antd'

interface StatisticCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, prefix,suffix }) => {
  return (
    <Card>
      <Statistic title={title} value={value} prefix={prefix} suffix={suffix} />
    </Card>
  )
}

export default StatisticCard