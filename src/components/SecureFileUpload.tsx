import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import {
  validateFileType,
  validateFileSize,
  ALLOWED_EVIDENCE_TYPES,
  MAX_FILE_SIZE,
  sanitizeFilename,
  getFileExtension,
} from '../utils/security';
import { fileApi } from '../services/api';
import { logAuditEvent } from '../utils/audit';

interface SecureFileUploadProps {
  sessionId: string;
  onUploadSuccess?: (fileUrl: string, fileId: string) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  userId: string;
  userRole: string;
}

interface FileWithPreview {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function SecureFileUpload({
  sessionId,
  onUploadSuccess,
  onUploadError,
  maxFiles = 5,
  userId,
  userRole,
}: SecureFileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!validateFileType(file, ALLOWED_EVIDENCE_TYPES)) {
      const allowedExtensions = ALLOWED_EVIDENCE_TYPES.map((type) => {
        if (type.includes('pdf')) return 'PDF';
        if (type.includes('wordprocessingml')) return 'DOCX';
        if (type.includes('png')) return 'PNG';
        if (type.includes('jpeg') || type.includes('jpg')) return 'JPG';
        return '';
      })
        .filter(Boolean)
        .join(', ');
      
      return {
        isValid: false,
        error: `ประเภทไฟล์ไม่รองรับ อนุญาตเฉพาะ: ${allowedExtensions}`,
      };
    }

    // Check file size
    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      return {
        isValid: false,
        error: `ขนาดไฟล์เกิน ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    return { isValid: true };
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = [];
    const remainingSlots = maxFiles - files.length;

    Array.from(selectedFiles).slice(0, remainingSlots).forEach((file) => {
      const validation = validateFile(file);
      
      if (validation.isValid) {
        const sanitizedName = sanitizeFilename(file.name);
        const fileWithPreview: FileWithPreview = {
          file: new File([file], sanitizedName, { type: file.type }),
          status: 'pending',
        };

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.file === file ? { ...f, preview: e.target?.result as string } : f
              )
            );
          };
          reader.readAsDataURL(file);
        }

        newFiles.push(fileWithPreview);
      } else {
        onUploadError?.(validation.error || 'Invalid file');
      }
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpload = async (fileWithPreview: FileWithPreview) => {
    setFiles((prev) =>
      prev.map((f) => (f === fileWithPreview ? { ...f, status: 'uploading' } : f))
    );

    try {
      const response = await fileApi.uploadEvidence(
        fileWithPreview.file,
        sessionId,
        `Uploaded by ${userId}`
      );

      if (response.success && response.data) {
        setFiles((prev) =>
          prev.map((f) =>
            f === fileWithPreview ? { ...f, status: 'success' } : f
          )
        );

        logAuditEvent(userId, userRole, 'file_upload', {
          resourceType: 'evidence',
          resourceId: response.data.fileId,
          success: true,
          details: {
            fileName: fileWithPreview.file.name,
            fileSize: fileWithPreview.file.size,
            fileType: fileWithPreview.file.type,
          },
        });

        onUploadSuccess?.(response.data.fileUrl, response.data.fileId);
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setFiles((prev) =>
        prev.map((f) =>
          f === fileWithPreview ? { ...f, status: 'error', error: errorMessage } : f
        )
      );

      logAuditEvent(userId, userRole, 'file_upload', {
        resourceType: 'evidence',
        success: false,
        details: { error: errorMessage },
      });

      onUploadError?.(errorMessage);
    }
  };

  const handleRemove = (fileToRemove: FileWithPreview) => {
    setFiles((prev) => prev.filter((f) => f !== fileToRemove));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getFileIcon = (file: File) => {
    const ext = getFileExtension(file.name);
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['png', 'jpg', 'jpeg'].includes(ext)) return '🖼️';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {files.length < maxFiles && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
          }}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            ลากไฟล์มาวางที่นี่ หรือ{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              คลิกเพื่อเลือกไฟล์
            </button>
          </p>
          <p className="text-sm text-gray-500">
            อนุญาตเฉพาะ: PDF, DOCX, PNG, JPG (สูงสุด {MAX_FILE_SIZE / 1024 / 1024}MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ALLOWED_EVIDENCE_TYPES.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileWithPreview, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* File Icon/Preview */}
              <div className="flex-shrink-0">
                {fileWithPreview.preview ? (
                  <img
                    src={fileWithPreview.preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
                    {getFileIcon(fileWithPreview.file)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {fileWithPreview.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileWithPreview.file.size)} • {fileWithPreview.file.type}
                </p>
                {fileWithPreview.error && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fileWithPreview.error}
                  </p>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                {fileWithPreview.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {fileWithPreview.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                {fileWithPreview.status === 'uploading' && (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
                {fileWithPreview.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleUpload(fileWithPreview)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    อัปโหลด
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(fileWithPreview)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          ไฟล์จะถูกตรวจสอบความปลอดภัยก่อนอัปโหลด และเก็บรักษาอย่างปลอดภัย
        </p>
      </div>
    </div>
  );
}

