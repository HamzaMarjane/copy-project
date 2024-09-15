"use client";

import { userFormCommunity } from "@ntla9aw/forms/src/community";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { useSession } from "next-auth/react";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = userFormCommunity();
  console.log("errors:", { errors });

  const { data: userData } = useSession();
  const { mutateAsync } = trpcClient.community.create.useMutation();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await mutateAsync({
            name: data.name,
            description: data.description,
            uid: userData?.user.uid,
          });
          // Redirect or show success message
        } catch (error) {
          console.error("Error creating community:", error);
          // Handle error
        }
      })}
    >
      <input placeholder="Name" type="text" {...register("name")} />
      <br />
      <textarea placeholder="Description" {...register("description")} />
      <br />
      <button type="submit">Create Community</button>
    </form>
  );
}
