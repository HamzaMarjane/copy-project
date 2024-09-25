"use client";

import { Button, Form, Select } from "antd";
import { Controller } from "react-hook-form";
import CustomButton from "../atoms/Button";
import { Typography } from "antd";
import { userFormTicket } from "@ntla9aw/forms/src/ticket";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { Event, User } from "../../utils/types";
import { useEffect, useState } from "react";

const { Title } = Typography;

const TicketForm = ({
  title,
  ticket_id,
}: {
  title: string;
  ticket_id?: string;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = userFormTicket();

  const [selectUserData, setSelectUserData] = useState<User[]>([]);
  const [selectEventData, setSelectEventData] = useState<Event[]>([]);

  // Fetch users and events data
  const fetchData = async () => {
    const usersResponse = await trpcClient.auth.users.useQuery();
    const eventsResponse = await trpcClient.event.events.useQuery({});
    
    if (usersResponse.data) setSelectUserData(usersResponse.data);
    if (eventsResponse.data) setSelectEventData(eventsResponse.data.events);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Title level={2}>{title}</Title>

      <Form
        name="event-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        onFinish={handleSubmit(async (data) => {
          // Handle form submission logic here
          console.log(data);
        })}
        autoComplete="off"
      >
        <Form.Item
          label="Assigned To"
          validateStatus={errors.uid ? "error" : ""}
        >
          <Controller
            name="uid"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                {selectUserData.map((user) => (
                  <Select.Option key={user.uid} value={user.uid}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
          {errors.uid && <p>{errors.uid.message}</p>}
        </Form.Item>

        <Form.Item
          label="Event"
          validateStatus={errors.event_id ? "error" : ""}
        >
          <Controller
            name="event_id"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                {selectEventData.map((event) => (
                  <Select.Option key={event.event_id} value={event.event_id}>
                    {event.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          />
          {errors.event_id && <p>{errors.event_id.message}</p>}
        </Form.Item>

        <Form.Item>
          <CustomButton
            style={{ marginRight: 7 }}
            label="Cancel"
            onClick={() => reset()} // Reset the form on cancel
          />
          <Button type="primary" htmlType="submit">
            {ticket_id ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default TicketForm;