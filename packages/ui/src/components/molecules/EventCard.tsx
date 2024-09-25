import React from "react";
import { Avatar, Card, Image, Tag } from "antd";
import { EventExtra } from "../../utils/types"; // Ensure this includes the necessary properties
import CustomButton from "../atoms/Button";


const { Meta } = Card;

const EventCard: React.FC<EventExtra> = ({
  title,
  image,
  tags,
  date,
  city,
  community
}) => {
  return (
    // <Badge count={<Typography style={{backgroundColor:'#5AB2FF',borderRadius:30,padding:'0 4px' }}>{badge}</Typography>}>
      <Card
        style={{ height: '100%' }}  
        cover={
          <Image
            alt="event"
            src={`${image}`}
          />
        }
        actions={[
          <CustomButton label="Book" onClick={()=>{ }} />,
        ]}
      >
        <Meta
          avatar={<Avatar src={`${community?.image}`} />}
          title={title}
        />
        <div style={{ marginTop: 10 }}>
          <div>
            {tags && tags.map((tag) => (
              <Tag key={tag.tag_id} color="blue" >{tag.name}</Tag>
            ))}
          </div>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Location:</strong> {city && city.name}</p>
        </div>
      </Card>
    // </Badge>
  );
};

export default EventCard;