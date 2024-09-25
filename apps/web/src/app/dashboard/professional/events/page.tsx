"use client";

import { Dayjs } from "dayjs";
import { useState, useContext, useCallback, useEffect } from "react";
import { DatePicker } from "antd";
import EventTable from "@ntla9aw/ui/src/components/molecules/EventTable";
import CustomButton from "@ntla9aw/ui/src/components/atoms/Button";
import EventForm from "@ntla9aw/ui/src/components/molecules/EventForm";
import { ModalContext } from "@ntla9aw/ui/src/components/molecules/ModalProvider";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { City, Event, TransformedEvent } from "@ntla9aw/ui/src/utils/types";

const { RangePicker } = DatePicker;

interface Filters {
  date_start: Dayjs | null;
  date_end: Dayjs | null;
}

const initialFilters: Filters = {
  date_start: null,
  date_end: null,
};

export default function DashboardEvent() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: userCommunity } = trpcClient.community.owner.useQuery();
  console.log(userCommunity);
  const { data: eventData, refetch } = trpcClient.event.events.useQuery(
    {
      community_id: userCommunity?.community_id,
      date_start: filters.date_start
        ? filters.date_start.format("YYYY-MM-DD")
        : undefined,
      date_end: filters.date_end
        ? filters.date_end.format("YYYY-MM-DD")
        : undefined,
      page: currentPage - 1, // Convert to 0-based index
      limit: pageSize,
    },
    {
      enabled: !!userCommunity?.community_id,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (userCommunity?.community_id) {
      refetch();
    }
  }, [userCommunity?.community_id, currentPage, pageSize, filters, refetch]);

  const { mutateAsync: deleteEvent } = trpcClient.event.delete.useMutation();
  const modalContext = useContext(ModalContext);

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setFilters({
      date_start: dates ? dates[0] : null,
      date_end: dates ? dates[1] : null,
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCreateNewEvent = useCallback(() => {
    if (modalContext) {
      modalContext.showModal(<EventForm title="Create New Event" />);
    }
  }, [modalContext]);

  const handleUpdateEvent = useCallback(
    (event: Event) => {
      if (modalContext) {
        modalContext.showModal(
          <EventForm title="Update Event" event_id={event.event_id} />,
        );
      }
    },
    [modalContext],
  );

  const handleDeleteEvent = useCallback(
    async (event_id: string) => {
      try {
        await deleteEvent({ event_id });
        refetch();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    },
    [deleteEvent, refetch],
  );

  const transformEventData = (
    events: TransformedEvent[],
  ): (Event & { city: City })[] => {
    return events.map((event) => ({
      ...event,
      date: new Date(event.date),
      city: {
        id: event.city_id,
        name: event.city.name,
        longitude: event.city.longitude,
        latitude: event.city.latitude,
      },
    }));
  };

  const handleTableChange = (pagination: {
    current?: number;
    pageSize?: number;
  }) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1em",
        }}
      >
        <CustomButton label="Create New Event" onClick={handleCreateNewEvent} />
        <RangePicker
          showTime
          value={[filters.date_start, filters.date_end]}
          onChange={handleDateChange}
        />
      </div>
      <EventTable
        data={eventData ? transformEventData(eventData.events) : []}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: eventData?.total || 0,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      />
    </>
  );
}
