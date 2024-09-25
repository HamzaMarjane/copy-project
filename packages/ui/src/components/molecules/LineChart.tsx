import React from 'react'
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface DataPoint {
  name: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  xDataKey: string
  yDataKey: string
  color?: string
}

const LineChart: React.FC<LineChartProps> = ({ data, xDataKey, yDataKey, color = "#8884d8" }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsLineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xDataKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={yDataKey} stroke={color} />
    </RechartsLineChart>
  </ResponsiveContainer>
)

export default LineChart