
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  maxFiles?: number;
  maxSize?: number; // em bytes
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  setFiles,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB por padrão
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`Você pode enviar no máximo ${maxFiles} arquivos.`);
        return;
      }

      const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        alert(`Alguns arquivos são muito grandes. O tamanho máximo é ${maxSize / (1024 * 1024)}MB.`);
        return;
      }

      setFiles(prev => [...prev, ...acceptedFiles]);
    },
    [files, maxFiles, maxSize, setFiles]
  );

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
  });

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + ' bytes';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension || '')) {
      return (
        <div className="h-8 w-8 rounded border bg-gray-100 flex items-center justify-center">
          <img 
            src={URL.createObjectURL(file)} 
            alt={file.name}
            className="h-8 w-8 object-cover rounded"
            onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
          />
        </div>
      );
    }
    
    return <FileText className="h-8 w-8 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-gray-400" />
          {isDragActive ? (
            <p>Solte os arquivos aqui...</p>
          ) : (
            <>
              <p>Arraste e solte arquivos aqui, ou clique para selecionar</p>
              <p className="text-xs text-gray-500">
                Máximo de {maxFiles} arquivos, {maxSize / (1024 * 1024)}MB cada
              </p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Arquivos selecionados ({files.length}/{maxFiles})</p>
          <ul className="border rounded-md divide-y">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 text-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getFileIcon(file)}
                  <div className="overflow-hidden">
                    <p className="truncate">{file.name}</p>
                    <p className="text-gray-500 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover arquivo</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
