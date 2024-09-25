"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaEventCreate } from "./schemas";

export type FormTypeSchema = z.infer<typeof formSchemaEventCreate>;
export const userFormEvent = () =>
  useForm<FormTypeSchema>({
    resolver: zodResolver(formSchemaEventCreate),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      city_id: "",
      address: "",
      longitude: null,
      latitude: null,
      type: "FREE" as const,
      ticketAmount: 0,
      TicketPrice: 0,
      tags: [],
    },
  });
