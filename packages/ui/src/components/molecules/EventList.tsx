import React from 'react'
import { Card, List, Button } from 'antd'

interface Event {
  title: string
  date: string
  city: { name: string }
  ticketAmount: number
}

interface EventListProps {
  events: Event[]
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <Card title="My Events" className="h-full">
      <List
        itemLayout="horizontal"
        dataSource={events}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button key="edit" type="link">Edit</Button>,
              <Button key="delete" type="link" danger>Delete</Button>,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={`${new Date(item.date).toLocaleDateString()} - ${item.city.name}`}
            />
            <div>{item.ticketAmount} tickets</div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default EventList