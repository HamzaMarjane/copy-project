"use client";
import { Col } from "antd";
import { ElementType } from "react";
import { Event } from "../../utils/types";

interface PreviewListProps {
  Card: ElementType;
  data: Event[] | undefined;
  lastEventElementRef: (node: HTMLDivElement | null) => void;
  onEventSelect: (event: Event) => void;
  selectedEvent: Event | null;
}

function EventList({ Card, data, lastEventElementRef, onEventSelect, selectedEvent }: PreviewListProps) {
  return (
    <Col span={17} style={{ backgroundColor: "#FFF9D0", padding: "1em" }}>
      {data &&
        data.map((item, index) => (
          <div
            key={item.event_id}
            ref={index === data.length - 1 ? lastEventElementRef : null}
            onClick={() => onEventSelect(item)}
            style={{ cursor: 'pointer' }}
          >
            <Card
              {...item}
              isSelected={selectedEvent?.event_id === item.event_id}
              onClick={() => onEventSelect(item)}
            />
          </div>
        ))}
    </Col>
  );
}

export default EventList;