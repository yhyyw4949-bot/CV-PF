import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../Toast';

interface FileUploadProps {
  label: string;
  currentValue: string;
  onUploadComplete: (url: string) => void;
  accept?: string;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  currentValue,
  onUploadComplete,
  accept = 'image/*',
  helperText = 'Upload a new file (JPEG, PNG, WEBP, GIF, SVG, or PDF up to 15MB)'
}) => {
  const { success, error: toastError } = useToast();
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      onUploadComplete(res.url);
      success(`File uploaded successfully: ${res.filename}`);
    } catch (err: any) {
      toastError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const applyCustomUrl = () => {
    if (customUrl.trim()) {
      onUploadComplete(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
      success('URL applied');
    }
  };

  const isImage = currentValue && (
    currentValue.endsWith('.png') ||
    currentValue.endsWith('.jpg') ||
    currentValue.endsWith('.jpeg') ||
    currentValue.endsWith('.webp') ||
    currentValue.endsWith('.gif') ||
    currentValue.endsWith('.svg') ||
    currentValue.startsWith('data:image') ||
    currentValue.includes('placeholder')
  );

  return (
    <div className="space-y-2">
      <label className="block font-mono text-xs text-slate-300 font-medium">
        {label}
      </label>

      {/* Current Preview */}
      {currentValue ? (
        <div className="p-3 rounded bg-cyber-950 border border-cyber-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImage ? (
              <div className="w-12 h-12 rounded border border-cyber-border bg-cyber-900 overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={currentValue}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded border border-cyber-border bg-cyber-900 flex items-center justify-center text-cyber-neon shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="overflow-hidden">
              <span className="font-mono text-xs text-slate-200 block truncate">
                {currentValue}
              </span>
              <span className="font-mono text-[10px] text-cyber-green flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Storage Asset
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUploadComplete('')}
            className="text-slate-400 hover:text-red-400 p-1.5 rounded transition-colors"
            title="Remove asset"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Upload Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${label.replace(/\s+/g, '-')}`}
        />
        <label
          htmlFor={`file-input-${label.replace(/\s+/g, '-')}`}
          className={`cursor-pointer px-3.5 py-2 rounded bg-cyber-900 border border-cyber-border hover:border-cyber-neon hover:text-cyber-neon font-mono text-xs flex items-center gap-2 transition-all ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {uploading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-cyber-neon border-t-transparent rounded-full animate-spin" />
              <span>UPLOADING TO STORAGE...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5 text-cyber-neon" />
              <span>UPLOAD LOCAL FILE</span>
            </>
          )}
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="px-3.5 py-2 rounded bg-cyber-950 border border-cyber-border hover:border-slate-500 font-mono text-xs text-slate-300 transition-colors"
        >
          {showUrlInput ? 'CANCEL URL' : 'SET DIRECT URL'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            placeholder="https://example.com/image.png or /uploads/..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded bg-cyber-950 border border-cyber-border text-xs font-mono text-slate-200 focus:outline-none focus:border-cyber-neon"
          />
          <button
            type="button"
            onClick={applyCustomUrl}
            className="px-3 py-1.5 rounded bg-cyber-neon text-cyber-950 font-mono text-xs font-bold"
          >
            APPLY
          </button>
        </div>
      )}

      {helperText && (
        <p className="font-mono text-[10px] text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
};
