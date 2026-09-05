"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table, Card, Typography, Tag, Button, Space, Popconfirm, Tooltip, Flex, App as AntdApp } from "antd";
import {
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileZipOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { fetcher } from "../lib/api-client";
import type { FileRecord, PaginatedFilesResponse } from "@repo/types";

const { Title, Text } = Typography;

interface FileListManagerProps {
  refreshTrigger?: number;
}

export function FileListManager({ refreshTrigger }: FileListManagerProps) {
  const { message } = AntdApp.useApp();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const loadFiles = useCallback(async (currentPage = page, currentLimit = limit) => {
    setLoading(true);
    try {
      const data = await fetcher<PaginatedFilesResponse>(
        `/storage/files?page=${currentPage}&limit=${currentLimit}`
      );
      if (data) {
        setFiles(data.data || []);
        setTotal(data.total || 0);
      }
    } catch {
      message.error("Failed to load files list.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, message]);

  useEffect(() => {
    loadFiles(page, limit);
  }, [loadFiles, refreshTrigger, page, limit]);

  const handleDownload = async (fileId: string) => {
    try {
      const res = await fetcher<{ downloadUrl: string }>(`/storage/files/${fileId}/download`);
      if (res?.downloadUrl) {
        window.open(res.downloadUrl, "_blank");
      } else {
        message.error("Failed to generate download URL.");
      }
    } catch {
      message.error("Download failed.");
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const res = await fetcher<{ success: boolean }>(`/storage/files/${fileId}`, {
        method: "DELETE",
      });
      if (res?.success) {
        message.success("File deleted successfully.");
        loadFiles(page, limit);
      }
    } catch {
      message.error("Failed to delete file.");
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
    if (mimeType.includes("image")) return <FileImageOutlined style={{ color: "#52c41a" }} />;
    if (mimeType.includes("zip") || mimeType.includes("compressed")) return <FileZipOutlined style={{ color: "#faad14" }} />;
    if (mimeType.includes("video")) return <VideoCameraOutlined style={{ color: "#722ed1" }} />;
    return <FileOutlined style={{ color: "#1677ff" }} />;
  };

  const columns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: FileRecord) => (
        <Space align="center">
          {getFileIcon(record.mimeType)}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size: number) => formatBytes(size),
    },
    {
      title: "MIME Type",
      dataIndex: "mimeType",
      key: "mimeType",
      render: (type: string) => <Tag>{type || "binary"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "COMPLETED") return <Tag color="success">COMPLETED</Tag>;
        if (status === "PENDING") return <Tag color="processing">PENDING</Tag>;
        return <Tag color="error">ABORTED</Tag>;
      },
    },
    {
      title: "Uploaded At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: FileRecord) => (
        <Space>
          <Tooltip title="Download via Presigned S3 URL">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id)}
              disabled={record.status !== "COMPLETED"}
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
        width: "100%",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
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

        <Button icon={<ReloadOutlined />} onClick={() => loadFiles(page, limit)} loading={loading}>
          Refresh
        </Button>
      </Flex>

      <Table
        dataSource={files}
        columns={columns}
        rowKey="id"
        loading={loading}
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
        locale={{ emptyText: "No uploaded files found. Use the drag & drop uploader above to store files." }}
      />
    </Card>
  );
}
