'use client';

import React, { useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Flex,
  App as AntdApp,
} from 'antd';
import {
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileZipOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '../lib/api-client';
import type { FileRecord, PaginatedFilesResponse } from '@repo/types';

const { Title, Text } = Typography;

interface FileListManagerProps {
  refreshTrigger?: number;
}

export function FileListManager({ refreshTrigger }: FileListManagerProps) {
  const { message } = AntdApp.useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['files', page, limit, refreshTrigger],
    queryFn: async () => {
      const res = await fetcher<PaginatedFilesResponse>(
        `/storage/files?page=${page}&limit=${limit}`,
      );
      if (!res) {
        throw new Error('Failed to load files list.');
      }
      return res;
    },
    placeholderData: keepPreviousData,
  });

  const files = data?.data || [];
  const total = data?.total || 0;

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const res = await fetcher<{ success: boolean }>(`/storage/files/${fileId}`, {
        method: 'DELETE',
      });
      if (!res?.success) {
        throw new Error('Failed to delete file.');
      }
      return res;
    },
    onMutate: async (deletedFileId) => {
      await queryClient.cancelQueries({ queryKey: ['files'] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ['files'],
      });

      queryClient.setQueriesData<PaginatedFilesResponse>({ queryKey: ['files'] }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((file) => file.id !== deletedFileId),
          total: Math.max(0, oldData.total - 1),
        };
      });

      return { previousQueries };
    },
    onError: (_err, _deletedFileId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, queryData]) => {
          queryClient.setQueryData(queryKey, queryData);
        });
      }
      message.error('Failed to delete file.');
    },
    onSuccess: () => {
      message.success('File deleted successfully.');
    },
  });

  const handleDownload = async (fileId: string) => {
    try {
      const res = await fetcher<{ downloadUrl: string }>(`/storage/files/${fileId}/download`);
      if (res?.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      } else {
        message.error('Failed to generate download URL.');
      }
    } catch {
      message.error('Download failed.');
    }
  };

  const handleDelete = (fileId: string) => {
    deleteMutation.mutate(fileId);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
    if (mimeType.includes('image')) return <FileImageOutlined style={{ color: '#52c41a' }} />;
    if (mimeType.includes('zip') || mimeType.includes('compressed'))
      return <FileZipOutlined style={{ color: '#faad14' }} />;
    if (mimeType.includes('video')) return <VideoCameraOutlined style={{ color: '#722ed1' }} />;
    return <FileOutlined style={{ color: '#1677ff' }} />;
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: FileRecord) => (
        <Space align="center">
          {getFileIcon(record.mimeType)}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatBytes(size),
    },
    {
      title: 'MIME Type',
      dataIndex: 'mimeType',
      key: 'mimeType',
      render: (type: string) => (
        <Tag
          style={{
            background: '#EFE7D8',
            color: '#1C1C1C',
            border: '1px solid rgba(28, 28, 28, 0.12)',
            fontWeight: 600,
            borderRadius: 12,
          }}
        >
          {type || 'binary'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'COMPLETED')
          return (
            <Tag
              style={{
                background: '#D1FAE5',
                color: '#064E3B',
                border: '1px solid #6EE7B7',
                fontWeight: 700,
                borderRadius: 12,
                padding: '2px 10px',
              }}
            >
              COMPLETED
            </Tag>
          );
        if (status === 'PENDING')
          return (
            <Tag
              style={{
                background: '#FEF3C7',
                color: '#78350F',
                border: '1px solid #FCD34D',
                fontWeight: 700,
                borderRadius: 12,
                padding: '2px 10px',
              }}
            >
              PENDING
            </Tag>
          );
        return (
          <Tag
            style={{
              background: '#FEE2E2',
              color: '#7F1D1D',
              border: '1px solid #FCA5A5',
              fontWeight: 700,
              borderRadius: 12,
              padding: '2px 10px',
            }}
          >
            ABORTED
          </Tag>
        );
      },
    },
    {
      title: 'Uploaded At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: FileRecord) => (
        <Space>
          <Tooltip title="Download via Presigned S3 URL">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id)}
              disabled={record.status !== 'COMPLETED'}
            >
              Download
            </Button>
          </Tooltip>

          <Popconfirm
            title="Delete file"
            description="Are you sure you want to delete this file from S3?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        width: '100%',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        marginTop: 24,
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <div>
          <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
            Uploaded Files Manager
          </Title>
          <Text type="secondary">View and manage your stored files on AWS S3.</Text>
        </div>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
          loading={isLoading || isFetching}
        >
          Refresh
        </Button>
      </Flex>

      <Table
        dataSource={files}
        columns={columns}
        rowKey="id"
        loading={isLoading || isFetching}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
          onChange: (p, ps) => {
            setPage(p);
            setLimit(ps);
          },
        }}
        locale={{
          emptyText: 'No uploaded files found. Use the drag & drop uploader above to store files.',
        }}
      />
    </Card>
  );
}
