"use client";

import React, { useState } from "react";
import { FileUploader } from "../../components/file-uploader";
import { FileListManager } from "../../components/file-list-manager";

export default function UploadPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
      <FileUploader onUploadSuccess={handleUploadSuccess} />
      <FileListManager refreshTrigger={refreshTrigger} />
    </div>
  );
}
