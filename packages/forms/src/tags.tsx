"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchemaTag } from "./schemas";

export type FormTypeSchema = z.infer<typeof formSchemaTag>;
export const userFormTag = () =>
  useForm<FormTypeSchema>({
    resolver: zodResolver(formSchemaTag),
  });
