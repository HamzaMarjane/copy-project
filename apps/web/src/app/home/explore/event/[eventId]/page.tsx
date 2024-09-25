"use client";
import React, { useEffect, useState } from "react";
import { Col, Image, Row, Space } from "antd";
import EventInfo from "@ntla9aw/ui/src/components/organisms/EventInfo"; // Adjust the import path as necessary
import PreviewList from "@ntla9aw/ui/src/components/organisms/PreviewList";
import EventCard from "@ntla9aw/ui/src/components/molecules/EventCard";
import CommunityCard from "@ntla9aw/ui/src/components/molecules/CommunityCard";
import Button from "@ntla9aw/ui/src/components/atoms/Button";
import TicketCard from "@ntla9aw/ui/src/components/molecules/TicketCard";
import { trpcStatic } from "@ntla9aw/trpc-client/src/static";
import { Community, EventExtra } from "@ntla9aw/ui/src/utils/types";
import { useParams, useRouter } from "next/navigation";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { useSession } from "next-auth/react";
export default function EventPage() {
  const { eventId } = useParams(); // eventId can be string or string[]
  const [eventData, setEventData] = useState<EventExtra>();
  const [eventsData, setEventsData] = useState<EventExtra[]>([]);
  const [communitiesData, setCommunitiesData] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userData } = useSession();
  const router = useRouter();
  // Ensure eventId is a string
  const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;

  useEffect(() => {
    async function fetchEventData() {
      if (eventIdString) {
        try {
          const data = await trpcStatic.event.event.query({
            event_id: eventIdString,
          });
          if (data) {
            setEventData(data);
          }
        } catch (err) {
          setError("Error Fetching Event");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchEventData();
  }, [eventIdString]);

  useEffect(() => {
    async function fetchEventsData() {
      try {
        const data = await trpcStatic.event.events.query({});
        if (data) {
          setEventsData(data.events);
        }
      } catch (err) {
        setError("Error Fetching Events");
        console.error(err);
      }
    }

    async function fetchCommunitiesData() {
      try {
        const data = await trpcStatic.community.commnunities.query(); // Fixed typo: commnunities to communities
        if (data) {
          setCommunitiesData(data);
        }
      } catch (err) {
        setError("Error Fetching Communities");
        console.error(err);
      }
    }

    fetchCommunitiesData();
    fetchEventsData();
  }, []);

  const handleBuyTicket = async () => {
    const { mutateAsync: booking } = trpcClient.event.booking.useMutation();

    if (!userData?.user?.uid) {
      router.push("/auth/signin");
      return;
    }

    try {
      await booking({
        status: "pending",
        uid: userData.user.uid,
        event_id: eventIdString,
      });
      // Add success notification or UI feedback
      console.log("Ticket booked successfully");
    } catch (error) {
      console.error("Failed to book ticket", error);
      // Add error notification or UI feedback
    }
  };
  console.log(loading, error, communitiesData);
  return (
    <div>
      {/* TODO EVENT IMAGE */}
      <div
        style={{
          height: 400,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image
          src={`${eventData?.image}`}
          // Replace with your event image URL
          alt="Event"
          style={{ objectFit: "fill", width: "100%", height: "400px" }}
        />
      </div>
      {/* TODO EVENT INFO */}
      <Row style={{ marginTop: 10 }} justify={"space-between"}>
        <Col span={17} style={{ backgroundColor: "#FFF9D0", padding: "1em" }}>
          <EventInfo title="Event Details" data={eventData} />
          <PreviewList
            style={{ overflowY: "auto", marginBottom: 20 }}
            Card={EventCard}
            data={eventsData}
            title="Events For You"
            Button={
              <Button
                label="View All Events"
                type="primary"
                onClick={() => {
                  console.log("Show More Events :)");
                }}
              />
            }
          />
          <PreviewList
            style={{ overflowY: "auto", marginBottom: 20 }}
            Card={CommunityCard}
            data={communitiesData}
            title="Communities For You"
            Button={
              <Button
                label="Join a Community"
                type="primary"
                onClick={() => {
                  console.log("Show More Communities :)");
                }}
              />
            }
          />
        </Col>
        <Col span={6} style={{ backgroundColor: "#FFF9D0", padding: "1em" }}>
          <Space direction="vertical">
            <TicketCard
              ticketAmount={eventData?.ticketAmount}
              onClick={handleBuyTicket}
            />
            {eventData?.community && <CommunityCard {...eventData.community} />}
          </Space>
        </Col>
      </Row>
      {/* TODO RESERVATION */}
      {/* TODO GROUP CARD */}
    </div>
  );
}
