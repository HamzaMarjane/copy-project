"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketFormSchema } from "./schemas";

export type FormTypeSchema = z.infer<typeof ticketFormSchema>;
export const userFormTicket = () =>
  useForm<FormTypeSchema>({
    resolver: zodResolver(ticketFormSchema),
  });
