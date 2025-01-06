import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { FileUp, FileSpreadsheet, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileUploadData } from '@/types/data';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
    acceptedFileTypes?: string[];
    maxFileSize?: number;
    title?: string;
    description?: string;
    onFileUpload: (fileData: FileUploadData) => void;
    onFileRemove?: () => void;
    className?: string;
    validateFile?: (file: File) => boolean;
    defaultFileName?: string;
    uploadProgress: number;
    setUploadProgress: (progress: number) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    acceptedFileTypes = ['.csv'],
    maxFileSize = 10 * 1024 * 1024,
    onFileUpload,
    onFileRemove,
    validateFile,
    defaultFileName,
    uploadProgress = 0,
    setUploadProgress,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const isValidFile = (selectedFile: File): boolean => {
        if (validateFile) {
            return validateFile(selectedFile);
        }
        const isValidType = acceptedFileTypes.some(type =>
            selectedFile.name.toLowerCase().endsWith(type.replace('*', '')) ||
            selectedFile.type.includes(type.replace('*', '').replace('.', ''))
        );

        const isValidSize = selectedFile.size <= maxFileSize;

        if (!isValidType) {
            toast.error('Invalid File Type', {
                description: `Only ${acceptedFileTypes.join(', ')} files are allowed`
            });
        }

        if (!isValidSize) {
            toast.error('File Too Large', {
                description: `Maximum file size is ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`
            });
        }

        return isValidType && isValidSize;
    };

    const handleFile = async (selectedFile: File) => {
        if (isValidFile(selectedFile)) {
            try {
                const base64String = await convertToBase64(selectedFile);

                const fileData: FileUploadData = {
                    // fileName: selectedFile.name.split('.')[0],
                    fileName: defaultFileName || selectedFile.name.split('.')[0],
                    fileExtension: selectedFile.name.split('.').pop() || '',
                    file: base64String.split(',')[1]
                };

                setFile(selectedFile);
                onFileUpload(fileData);

                toast.success('File Uploaded', {
                    description: `${selectedFile.name} has been successfully uploaded`
                });

                // // Simulating file upload progress
                // const simulateUploadProgress = () => {
                //     let progress = 0;
                //     const interval = setInterval(() => {
                //         if (progress < 100) {
                //             progress += 10;
                //             setUploadProgress(progress);
                //         } else {
                //             clearInterval(interval);
                //         }
                //     }, 500);
                // };
                // simulateUploadProgress();

            } catch (error) {
                toast.error('File Conversion Failed', {
                    description: 'Unable to convert file to base64'
                });
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setFile(null);
        setUploadProgress(0);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        onFileRemove?.();
    };

    const FileIcon = () => {
        const iconMap: { [key: string]: React.ElementType } = {
            '.csv': FileSpreadsheet,
            '.pdf': FileText,
        };

        const matchedIcon = Object.entries(iconMap).find(([type]) =>
            acceptedFileTypes.includes(type)
        );

        const Icon = matchedIcon ? matchedIcon[1] : FileUp;
        return <Icon className={`w-12 h-12 ${dragActive ? 'text-primary' : 'text-gray-400'}`} />;
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
            relative p-8 text-center border-2 border-dashed rounded-lg 
            transition-all duration-300 ease-in-out
            ${dragActive
                    ? 'border-primary bg-primary/10 scale-105'
                    : 'border-gray-300 hover:border-primary'}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept={acceptedFileTypes.join(',')}
                onChange={handleChange}
                className="hidden"
            />

            {!file ? (
                <div
                    className={`
                    flex flex-col items-center justify-center gap-4
                    ${dragActive ? 'text-primary' : 'text-gray-500'}
                  `}
                >
                    <FileIcon />
                    <p>
                        {dragActive
                            ? 'Drop your file here'
                            : `Drag and drop ${acceptedFileTypes.join(', ')} or click to browse`}
                    </p>
                    <Button
                        variant="default"
                        onClick={() => inputRef.current?.click()}
                    >
                        Browse Files
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileIcon />
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={removeFile}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            )}

            {/* Progress bar */}
            {uploadProgress > 0 && (
                <div className="mt-4">
                    <Progress value={uploadProgress} className='h-2' max={100} />
                </div>
            )}
            {/* {uploadProgress === 100 && (
                <div className="mt-4 flex items-center justify-center text-green-600">
                    <Check className="w-6 h-6 mr-2" />
                    <p className="font-medium">Upload Complete!</p>
                    {errMessage && <p className="font-medium">{errMessage}</p>}
                </div>
            )} */}
        </div>
    );
};

export default FileUploader;
