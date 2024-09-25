"use client";
import { Col, Layout, Row, Typography } from "antd";
import { CSSProperties, ReactElement } from "react";
import { Community, EventExtra } from "../../utils/types";

const { Content } = Layout;
const { Title } = Typography;

interface PreviewListProps {
  Card: React.ElementType; // Use ElementType for components
  data: EventExtra[] | Community[]; // Define the type of data more specifically if possible
  title: string;
  Button: ReactElement;
  style?:CSSProperties
}

function PreviewList({ Card, data, title, Button ,style}: PreviewListProps) {
  return (
    <Content>
      <Row justify={'space-between'} align={'middle'}>
        <Title>{title}</Title>  
        {Button}
      </Row>
      {/* Wrap the Row in a div for scrolling  {  overflowY: 'auto', marginBottom: 20 }*/}
      <div style={style}>
        <Row gutter={[32, 32]} style={{ minWidth: 1200 }}> {/* Maintain spacing between items */}
          {data.slice(0, 4).map((item, index) => (
            <Col span={6} key={index}> {/* Specify span for responsive layout */}
              <Card {...item} /> {/* Pass item props to Card */}
            </Col>
          ))}
        </Row>
      </div>
    </Content>
  );
}

export default PreviewList;