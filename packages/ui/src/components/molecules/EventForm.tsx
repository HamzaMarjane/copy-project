"use client";

import { useState, useEffect } from "react";
import { Button, Input, Form, DatePicker, Select, InputNumber } from "antd";
import { Controller } from "react-hook-form";
import CustomButton from "../atoms/Button";
import { Typography } from "antd";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import ImageUpload from "../atoms/ImageUpload";
import TagSelector from "../atoms/TagSelector";
import { City } from "../../utils/types";
import { userFormEvent } from "@ntla9aw/forms/src/event";

const { Title } = Typography;

const EventForm = ({
  title,
  event_id,
}: {
  title: string;
  event_id?: string;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = userFormEvent()

  const [cities, setCities] = useState<City[]>([]);
  const { data: userData } = useSession();
  const { mutateAsync: createEvent } = trpcClient.event.create.useMutation();
  const { data: citiesData } = trpcClient.navigation.cities.useQuery();
  const { data: eventData, isLoading: isEventLoading } = trpcClient.event.event.useQuery({ event_id });
  const [communityId, setCommunityId] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);

  const eventType = watch('type');

  useEffect(() => {
    if (citiesData) {
      setCities(citiesData);
    }
  }, [citiesData]);

  useEffect(() => {
    const getCommunity = async () => {
      if (userData?.user?.uid) {
        try {
          const {data:community} = await trpcClient.community.owner.useQuery();

          setCommunityId(community?.community_id);
        } catch (error) {
          console.error("Error fetching community:", error);
        }
      }
    };

    getCommunity();
  }, [userData]);

  useEffect(() => {
    if (eventData && !isEventLoading) {
      reset(eventData);
    }
  }, [eventData, isEventLoading, reset]);


  return (
    <>
      <Title level={2}>{title}</Title>

      <Form
        name="event-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        onFinish={handleSubmit(async (data) => {
          try {
            if (file) {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "ml_default");
      
              const uploadResponse = await fetch(
                "https://api.cloudinary.com/v1_1/dc0jqirfl/image/upload",
                {
                  method: "POST",
                  body: formData,
                }
              );
      
              const uploadData = await uploadResponse.json();
              data.image = uploadData.secure_url;
            }
      
            data.uid = userData?.user?.uid ?? undefined;
            data.community_id = communityId ?? undefined;
      
            if (event_id) {
              data.event_id = event_id;
            }
            const response = await createEvent(data);
            console.log("Event created:", response);
          } catch (error) {
            console.error("Event operation error:", error);
          }
        })}
        autoComplete="off"
      >
        <Form.Item label="Title" validateStatus={errors.title ? "error" : ""}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Title" />}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </Form.Item>

        <Form.Item label="Description" validateStatus={errors.description ? "error" : ""}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea {...field} placeholder="Description" value={field.value || ""} />
            )}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </Form.Item>

        <Form.Item label="Date" validateStatus={errors.date ? "error" : ""}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                showTime
                onChange={(date) => {
                  field.onChange(date ? date.toISOString() : null);
                }}
                value={field.value ? dayjs(field.value) : null}
              />
            )}
          />
          {errors.date && <p>{errors.date.message}</p>}
        </Form.Item>

        <Form.Item label="Location" validateStatus={errors.city_id ? "error" : ""}>
          <Controller
            name="city_id"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={cities.map((city) => ({
                  value: city.id,
                  label: city.name,
                }))}
              />
            )}
          />
          {errors.city_id && <p>{errors.city_id.message}</p>}
        </Form.Item>

        <Form.Item label="Address" validateStatus={errors.address ? "error" : ""}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Address" value={field.value || ""} />}
          />
          {errors.address && <p>{errors.address.message}</p>}
        </Form.Item>

        <Form.Item label="Longitude" validateStatus={errors.longitude ? "error" : ""}>
          <Controller
            name="longitude"
            control={control}
            render={({ field }) => <InputNumber {...field} />}
          />
          {errors.longitude && <p>{errors.longitude.message}</p>}
        </Form.Item>

        <Form.Item label="Latitude" validateStatus={errors.latitude ? "error" : ""}>
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => <InputNumber {...field} />}
          />
          {errors.latitude && <p>{errors.latitude.message}</p>}
        </Form.Item>

        <Form.Item label="Event Type" validateStatus={errors.type ? "error" : ""}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <Select.Option value="FREE">Free</Select.Option>
                <Select.Option value="PAID">Paid</Select.Option>
              </Select>
            )}
          />
          {errors.type && <p>{errors.type.message}</p>}
        </Form.Item>

        <Form.Item label="Ticket Amount" validateStatus={errors.ticketAmount ? "error" : ""}>
          <Controller
            name="ticketAmount"
            control={control}
            render={({ field }) => <InputNumber {...field} />}
          />
          {errors.ticketAmount && <p>{errors.ticketAmount.message}</p>}
        </Form.Item>

        {eventType === 'PAID' && (
          <Form.Item label="Ticket Price" validateStatus={errors.TicketPrice ? "error" : ""}>
            <Controller
              name="TicketPrice"
              control={control}
              render={({ field }) => <InputNumber {...field} />}
            />
            {errors.TicketPrice && <p>{errors.TicketPrice.message}</p>}
          </Form.Item>
        )}

        <Form.Item label="Tags" validateStatus={errors.tags ? "error" : ""}>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagSelector
                selectedTags={field.value || []}
                onTagChange={(tags) => field.onChange(tags)}
              />
            )}
          />
          {errors.tags && <p>{errors.tags.message}</p>}
        </Form.Item>

        <Form.Item label="Image" validateStatus={errors.image ? "error" : ""}>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUpload
                onChange={(file) => {
                  setFile(file);
                  field.onChange(file);
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <CustomButton
            style={{ marginRight: 7 }}
            label="Cancel"
            onClick={() => {}}
          />
          <Button type="primary" htmlType="submit">
            {event_id ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default EventForm;