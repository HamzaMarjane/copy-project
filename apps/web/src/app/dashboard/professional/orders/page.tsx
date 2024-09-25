"use client";

import { Dayjs } from "dayjs";
import { useState, useContext, useCallback } from "react";
import { DatePicker } from "antd";
import TicketTable from "@ntla9aw/ui/src/components/molecules/TicketTable";
import CustomButton from "@ntla9aw/ui/src/components/atoms/Button";
import TicketForm from "@ntla9aw/ui/src/components/molecules/TicketForm";
import { ModalContext } from "@ntla9aw/ui/src/components/molecules/ModalProvider";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { Ticket } from "@ntla9aw/ui/src/utils/types";

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

  const { data: ticketData, refetch } = trpcClient.ticket.tickets.useQuery({
    date_start: filters.date_start
      ? filters.date_start.format("YYYY-MM-DD")
      : undefined,
    date_end: filters.date_end
      ? filters.date_end.format("YYYY-MM-DD")
      : undefined,
    page: currentPage,
    limit: pageSize,
  });

  const { mutateAsync: deleteEvent } = trpcClient.ticket.delete.useMutation();
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
      modalContext.showModal(<TicketForm title="Create New Ticket" />);
    }
  }, [modalContext]);

  const handleUpdateEvent = useCallback(
    (ticket: Ticket) => {
      if (modalContext) {
        modalContext.showModal(
          <TicketForm title="Update Ticket" ticket_id={ticket.ticket_id} />,
        );
      }
    },
    [modalContext],
  );

  const handleDeleteEvent = useCallback(
    async (ticketId: string) => {
      try {
        await deleteEvent({ ticketId });
        refetch();
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    },
    [deleteEvent, refetch],
  );

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
        <CustomButton
          label="Create New Ticket"
          onClick={handleCreateNewEvent}
        />
        <RangePicker
          showTime
          value={[filters.date_start, filters.date_end]}
          onChange={handleDateChange}
        />
      </div>
      Event
      <TicketTable
        data={ticketData?.tickets || []}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: ticketData?.total || 0,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      />
    </>
  );
}
