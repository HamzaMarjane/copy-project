import React, { useState } from 'react';
import { Upload, Image, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange }) => {
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async (info) => {
    const { fileList: newFileList, file } = info;

    setFileList(newFileList);

    if (file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (file.status === 'done') {
      setLoading(false);
      const uploadedFile = file.originFileObj;
      if (uploadedFile instanceof File) {
        onChange(uploadedFile);
        try {
          const base64 = await getBase64(uploadedFile as RcFile);
          setPreviewImage(base64);
        } catch (error) {
          console.error('Error processing image:', error);
          message.error('Failed to process image');
        }
      } else {
        console.error('Invalid file object:', uploadedFile);
        message.error('Invalid file object');
      }
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        customRequest={({ onSuccess }) => {
          setTimeout(() => {
            onSuccess!("ok");
          }, 0);
        }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Image
        style={{ display: 'none' }}
        src={previewImage}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
      />
    </>
  );
};

export default ImageUpload;