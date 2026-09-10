'use client';

import React, { useState } from 'react';
import { Upload, Card, Typography, Progress, Button, Space, Alert, Tag, Flex } from 'antd';
import {
  InboxOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { uploadFileToS3 } from '../lib/s3-uploader';
import { formatBytes } from '../lib/formatters';
import { MULTIPART_THRESHOLD_BYTES, type FileRecord } from '@repo/types';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface FileUploaderProps {
  onUploadSuccess?: (fileRecord: FileRecord) => void;
}

interface ActiveUploadState {
  jobId: string;
  file: File;
  status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error';
  progress: number;
  controller?: AbortController;
  errorMessage?: string;
  isMultipart: boolean;
  result?: FileRecord;
}

export function FileUploader({ onUploadSuccess }: FileUploaderProps) {
  const [activeUploads, setActiveUploads] = useState<ActiveUploadState[]>([]);

  const startUpload = async (file: File) => {
    const jobId = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const isMultipart = file.size > MULTIPART_THRESHOLD_BYTES;
    const controller = new AbortController();

    const initialState: ActiveUploadState = {
      jobId,
      file,
      status: 'uploading',
      progress: 0,
      controller,
      isMultipart,
    };

    setActiveUploads((prev) => [initialState, ...prev]);

    try {
      await uploadFileToS3({
        file,
        signal: controller.signal,
        onProgress: (percent) => {
          setActiveUploads((prev) =>
            prev.map((item) =>
              item.jobId === jobId ? { ...item, progress: percent, status: 'uploading' } : item,
            ),
          );
        },
        onSuccess: (res) => {
          setActiveUploads((prev) =>
            prev.map((item) =>
              item.jobId === jobId ? { ...item, status: 'completed', result: res } : item,
            ),
          );
          onUploadSuccess?.(res);
        },
        onError: (err) => {
          const message = controller.signal.aborted
            ? 'Upload cancelled by user'
            : err.message || 'Upload failed';

          setActiveUploads((prev) =>
            prev.map((item) =>
              item.jobId === jobId
                ? {
                    ...item,
                    status: controller.signal.aborted ? 'paused' : 'error',
                    errorMessage: message,
                  }
                : item,
            ),
          );
        },
      });
    } catch {
      // Top level errors are delivered via onError callback, state updated accordingly
    }
  };

  const cancelUpload = (jobId: string) => {
    setActiveUploads((prev) => {
      const target = prev.find((item) => item.jobId === jobId);
      target?.controller?.abort();
      return prev.filter((item) => item.jobId !== jobId);
    });
  };

  return (
    <Card
      style={{
        width: '100%',
        borderRadius: 20,
        boxShadow: '0 8px 30px rgba(28, 28, 28, 0.05)',
        border: '1px solid rgba(28, 28, 28, 0.08)',
      }}
    >
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ marginTop: 0, marginBottom: 4, color: '#1C1C1C' }}>
            <CloudUploadOutlined style={{ marginRight: 8, color: '#143F3A' }} />
            AWS S3 Multipart File Upload
          </Title>
          <Text type="secondary" style={{ color: '#4A4A4A' }}>
            Upload files of any size. Files larger than 10MB are automatically processed using S3
            Parallel Multipart Upload chunks.
          </Text>
        </div>

        <Dragger
          multiple={false}
          showUploadList={false}
          beforeUpload={(file) => {
            startUpload(file as File);
            return false; // Prevent default form upload
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Supports single presigned PUT for files ≤10MB, and 3-worker parallel S3 Multipart upload
            for files &gt;10MB.
          </p>
        </Dragger>

        {activeUploads.length > 0 && (
          <Space orientation="vertical" style={{ width: '100%' }} size="middle">
            <Text strong style={{ color: '#1C1C1C' }}>
              Active Upload Jobs
            </Text>
            {activeUploads.map((item) => {
              const { jobId, file, status, progress, isMultipart, errorMessage } = item;

              return (
                <Card
                  key={jobId}
                  size="small"
                  style={{
                    borderRadius: 12,
                    border:
                      status === 'error' ? '1px solid #FCA5A5' : '1px solid rgba(28, 28, 28, 0.08)',
                    background: '#FFFFFF',
                  }}
                >
                  <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                    <Space align="center">
                      <FileOutlined style={{ fontSize: 20, color: '#143F3A' }} />
                      <div>
                        <Text strong style={{ fontSize: 14, color: '#1C1C1C' }}>
                          {file.name}
                        </Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12, color: '#4A4A4A' }}>
                            {formatBytes(file.size)}
                          </Text>
                          {isMultipart ? (
                            <Tag color="info" style={{ marginLeft: 8 }}>
                              S3 Multipart
                            </Tag>
                          ) : (
                            <Tag color="success" style={{ marginLeft: 8 }}>
                              Single PUT
                            </Tag>
                          )}
                        </div>
                      </div>
                    </Space>

                    <Space align="center">
                      {status === 'uploading' && (
                        <Button
                          type="text"
                          danger
                          icon={<CloseCircleOutlined />}
                          onClick={() => cancelUpload(jobId)}
                        >
                          Cancel
                        </Button>
                      )}
                      {status === 'completed' && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          Completed
                        </Tag>
                      )}
                      {status === 'error' && (
                        <Tag color="error" icon={<CloseCircleOutlined />}>
                          Failed
                        </Tag>
                      )}
                    </Space>
                  </Flex>

                  {status === 'uploading' && (
                    <>
                      <Progress
                        percent={progress}
                        status="active"
                        strokeColor={{
                          '0%': '#143F3A',
                          '100%': '#5FC2AE',
                        }}
                      />
                    </>
                  )}

                  {status === 'error' && (
                    <Alert
                      title="Upload Failed"
                      description={errorMessage || 'Unknown S3 error'}
                      type="error"
                      showIcon
                      style={{ marginTop: 8 }}
                    />
                  )}
                </Card>
              );
            })}
          </Space>
        )}
      </Space>
    </Card>
  );
}
