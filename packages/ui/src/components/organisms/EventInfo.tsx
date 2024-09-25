import React from "react";
import { List, Typography } from "antd";
import { EventExtra } from "../../utils/types";

const { Title, Text } = Typography;

interface EventInfoProps {
  title: string; // Title of the event
  data: EventExtra | undefined; // Data should be an object with key-value pairs
}

const EventInfo: React.FC<EventInfoProps> = ({ title, data }) => {
  // Define the keys you want to display
  const eventKeys: (keyof EventExtra)[] = [
    'title',
    'description',
    'date',
    'address',
  ];
  if(!data) {
    return 
  }
  return (
    <>
      <Title level={1}>{title}</Title>
      <List
        itemLayout="horizontal"
        dataSource={eventKeys} // Use defined keys for the list
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text strong>{item}</Text>} // Use Text instead of Title for item keys
              description={data[item] !== undefined ? String(data[item]) : "N/A"} // Display the value as the description, handle undefined values
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default EventInfo;