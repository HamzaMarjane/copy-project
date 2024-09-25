"use client";
import React, { useEffect, useState } from "react";
import PreviewList from "@ntla9aw/ui/src/components/organisms/PreviewList";
import EventCard from "@ntla9aw/ui/src/components/molecules/EventCard";
import CommunityCard from "@ntla9aw/ui/src/components/molecules/CommunityCard";
import Button from "@ntla9aw/ui/src/components/atoms/Button";
import { trpcStatic } from "@ntla9aw/trpc-client/src/static";
import { Community, EventExtra } from "@ntla9aw/ui/src/utils/types";

const PreviewPage = () => {
  const [eventsData, setEventsData] = useState<EventExtra[]>([]);
  const [communitiesData, setCommunitiesData] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ensure eventId is a string

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
    setLoading(false);
  }, []);
  console.log(loading, error);

  return (
    <>
      <PreviewList
        Card={EventCard}
        data={eventsData}
        title="Upcoming Events"
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
        Card={EventCard}
        data={eventsData}
        title="Popular Events"
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
    </>
  );
};

export default PreviewPage;
