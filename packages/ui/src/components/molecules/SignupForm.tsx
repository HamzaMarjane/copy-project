"use client";

import  { useState } from 'react';
import { Button, Input, Form, Upload, Image } from "antd";
import { Controller } from "react-hook-form";
import { userFormRegister } from "@ntla9aw/forms/src/register";
import CustomButton from "../atoms/Button";
import { Typography } from "antd";
import { trpcClient } from "@ntla9aw/trpc-client/src/client";
import { signIn } from "next-auth/react";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js

const { Title } = Typography;

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const SignupForm = ({ title }: { title: string }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = userFormRegister();
  const { mutateAsync } = trpcClient.auth.registerWithCredentials.useMutation();
const router = useRouter(); // Initialize useRouter

  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleLoginClick = () => {
    router.push('/auth/signin'); // Navigates to login
  };


  return (
    <>
      <Title level={2}>{title}</Title>

      <Form
        name="signup"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 21 }}
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
      
          } catch (error) {
            console.error("Registration error:", error);
          }
          console.log("data:", data);
          const user = await mutateAsync(data);
          console.log("user:", user);
          if (user?.user) {
            await signIn("credentials", {
              email: data.email,
              password: data.password,
              callbackUrl: "/auth/subscription",
            });
          }
        router.push('/auth/subscription');

        })}
        autoComplete="off"
      >
        <Form.Item
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field  }) => <Input {...field} placeholder="email" />}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input.Password {...field} placeholder="password" />}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="name" />}
          />
        </Form.Item>

        <Form.Item valuePropName="fileList">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            listType="picture-card"
            showUploadList={false}
            onPreview={handlePreview}
          >
            <Button style={{ border: 0, background: "none" }} icon={<PlusOutlined />}>
              Upload
            </Button>
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>

        <Form.Item style={{ display: "flex", flexWrap: "nowrap", flexDirection: "column" }}>
          <CustomButton
            style={{ marginRight: 7 }}
            label="Log in"
            onClick={handleLoginClick}
          />
          <Button type="primary" htmlType="submit" >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignupForm;