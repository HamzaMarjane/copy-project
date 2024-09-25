"use client";

import { useEffect, useState } from "react";
import { trpcStatic } from "@ntla9aw/trpc-client/src/static";
import { Form, Tag, Typography, Button, Spin, Space } from "antd";
import { Controller } from "react-hook-form";
import { userFormTag } from "@ntla9aw/forms/src/tags";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { useRouter } from "next/navigation";
import { Tag as ITag } from "../../utils/types";

const { Title } = Typography;

export default function TagForm({ title }: { title: string }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = userFormTag();
  const { mutateAsync } = trpcClient.tag.submitTags.useMutation();
  const router = useRouter();

  const [tags, setTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const fetchedTags = await trpcStatic.tag.getAllTags.query();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  // Handle tag selection
  const handleTagChange = (tagId: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tagId]
      : selectedTags.filter((t) => t !== tagId);

    setSelectedTags(nextSelectedTags);
  };

  // Handle form submission
  const onSubmit = async () => {
    try {
      await mutateAsync({ tags: selectedTags });
      console.log("Tags submitted successfully:", selectedTags);
      router.push("/dashboard/personal");
    } catch (error) {
      console.error("Error submitting tags:", error);
    }
  };

  if (loading) {
    return <Spin tip="Loading tags..." />;
  }

  return (
    <>
      <Title level={3}>{title}</Title>
      <Form onFinish={handleSubmit(onSubmit)}       style={{ maxWidth: 400 }}
 autoComplete="off">
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <Space wrap={true} align="center"> 
              {tags.map((tag) => (
                <Tag.CheckableTag
                  key={tag.tag_id}
                  checked={selectedTags.includes(tag.tag_id)}
                  onChange={(checked) => {
                    handleTagChange(tag.tag_id, checked);
                    field.onChange(selectedTags);
                  }}
                >
                  {tag.name}
                </Tag.CheckableTag>
              ))}
            </Space>
          )}
        />
        {errors.tags && <div style={{ color: "red" }}>{errors.tags.message}</div>}
        <Button type="primary" htmlType="submit" style={{ marginTop: "1em" }}>
          Submit
        </Button>
      </Form>
    </>
  );
}
