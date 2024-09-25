import React, { MouseEvent } from "react";
import { Avatar, Card, Image, Tag, Typography } from "antd";
import { EventExtra } from "../../utils/types";
import CustomButton from "../atoms/Button";
import { useRouter } from "next/navigation";

const { Meta } = Card;

interface EventListItemProps extends EventExtra {
  isSelected?: boolean;
  onClick: () => void;
}

const EventListItem: React.FC<EventListItemProps> = ({
  event_id,
  image,
  title,
  date,
  city,
  address,
  tags,
  community,
  ticketAmount,
  TicketPrice,
  isSelected,
  onClick,
}) => {
  const router = useRouter();

  const handleBookClick = (e: MouseEvent) => {
    e.stopPropagation();
    router.push(`/explore/event/${event_id}`);
  };

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "auto",
        padding: "16px",
        position: "relative",
        border: isSelected ? "2px solid #1890ff" : "1px solid #d9d9d9",
        backgroundColor: isSelected ? "#e6f7ff" : "white",
      }}
      onClick={onClick}
      cover={
        <Image
          alt="event"
          src={`${image}`}
          style={{ height: "150px", marginRight: "16px", objectFit: 'cover' }}
        />
      }
    >
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Meta
          avatar={
            <Avatar src={community?.image} />
          }
          title={title}
          description={community?.name || ""}
        />
        <div style={{ marginTop: 10 }}>
          <div>
            {tags && tags.map((tag, index) => (
              <Tag key={index} color="blue">
                {tag.name}
              </Tag>
            ))}
          </div>
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Location:</strong> {address}, {city && city.name}
          </p>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          width: 100,
          backgroundColor: '#A0DEFF'
        }}
      >
        <div>
          <Typography.Text strong>Tickets:</Typography.Text> {ticketAmount}
        </div>
        <div>
          <Typography.Text strong>Price:</Typography.Text> {TicketPrice && TicketPrice > 0 ? `${TicketPrice}` : 'Free'}
        </div>
        <div>
          <CustomButton label="Book" onClick={handleBookClick} />
        </div>
      </div>
    </Card>
  );
};

export default EventListItem;