"use client";

import CustomFilter from "@ntla9aw/ui/src/components/molecules/CustomFilter";
import EventList from "@ntla9aw/ui/src/components/organisms/EventList";
import EventListItem from "@ntla9aw/ui/src/components/molecules/EventListItem";
import { useEffect, useState, useRef, useCallback } from "react";
import { Col, Row } from "antd";
import dynamic from "next/dynamic";
import { EventExtra, Tag } from "@ntla9aw/ui/src/utils/types";
import { trpcStatic } from "@ntla9aw/trpc-client/src/static";
import { useSearchParams } from "next/navigation";

const CustomMap = dynamic(
  () => import("@ntla9aw/ui/src/components/organisms/CustomMap"),
  { ssr: false },
);

interface Filters {
  date_start: string | undefined;
  date_end: string | undefined;
  order: string | undefined;
  tags: Tag[];
  title: string | undefined;
  city: string | undefined;
}

const ITEMS_PER_PAGE = 8;

export default function Explore() {
  const [filters, setFilters] = useState<Filters>({
    date_start: undefined,
    date_end: undefined,
    order: "newest",
    tags: [],
    title: undefined,
    city: undefined,
  });
  const [eventsData, setEventsData] = useState<EventExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventExtra | null>(null);
  const searchParams = useSearchParams();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // Fetch events with filters
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const queryFilters = {
        ...filters,
        tags: filters.tags.map((tag) => tag.name), // Assuming Tag has a 'name' property
        page,
        limit: ITEMS_PER_PAGE,
      };
      const { events: data } =
        await trpcStatic.event.events.query(queryFilters);

      if (data) {
        setEventsData((prevEvents) => [...prevEvents, ...data]);
        setHasMore(data.length === ITEMS_PER_PAGE);
        if (page === 0 && eventsData.length > 0 && !selectedEvent) {
          setSelectedEvent(eventsData[0]);
        }
      }
    } catch (err) {
      setError("Error Fetching Events");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters, eventsData, selectedEvent]);

  // Extract title and city from URL and set them as initial filters
  useEffect(() => {
    const title = searchParams.get("title") || undefined;
    const city = searchParams.get("city") || undefined;

    setFilters((prevFilters) => ({
      ...prevFilters,
      title,
      city,
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setEventsData([]);
    setPage(0);
    setHasMore(true);
  };
  const handleEventSelect = (event: EventExtra) => {
    setSelectedEvent(event);
  };
  console.log(error);
  console.log(eventsData);
  console.log(loading);
  return (
    <>
      <CustomFilter filters={filters} setFilters={handleFilterChange} />
      <Row style={{ marginTop: 10 }} justify="space-between">
        <EventList
          Card={EventListItem}
          data={eventsData}
          lastEventElementRef={lastEventElementRef}
          onEventSelect={handleEventSelect}
          selectedEvent={selectedEvent}
        />

        <Col span={6} style={{ backgroundColor: "#FFF9D0", padding: "1em" }}>
          <CustomMap
            position={
              selectedEvent
                ? [selectedEvent.latitude, selectedEvent.longitude]
                : [33, -7]
            }
            zoom={13}
          />
        </Col>
      </Row>
    </>
  );
}
