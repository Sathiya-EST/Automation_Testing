import { Input } from "@/components/ui/input";
import { convertToBase64 } from "@/utils/convertBase64";
import { File } from "lucide-react";

const isValidFile = (file: File, maxFileLimit: number, acceptTypes: string[]): boolean => {
    const fileSize = file.size / 1024 / 1024;
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isAcceptedType = acceptTypes.length > 0 ? acceptTypes.includes(fileExtension) : true;
    return fileSize <= maxFileLimit && isAcceptedType;
};

interface FileUploadProps {
    onFileUpload: (fileData: FileUploadData) => void;
    acceptTypes: string[];
    maxFileLimit: number;
    defaultFileName?: string;
}

interface FileUploadData {
    fileName: string;
    fileExtension: string;
    file: string;
}

const FileUpload = ({
    onFileUpload,
    acceptTypes,
    maxFileLimit,
    defaultFileName = '',
}: FileUploadProps) => {
    // const [uploadProgress, setUploadProgress] = useState(0);
    // const [file, setFile] = useState<File | null>(null);

    const handleFile = async (selectedFile: File) => {
        if (isValidFile(selectedFile, maxFileLimit, acceptTypes)) {
            try {
                const base64String = await convertToBase64(selectedFile);

                const fileData: FileUploadData = {
                    fileName: defaultFileName || selectedFile.name.split('.')[0],
                    fileExtension: selectedFile.name.split('.').pop() || '',
                    file: base64String.split(',')[1], 
                };

                // setFile(selectedFile);
                onFileUpload(fileData);

                // toast.success('File Uploaded', {
                //     description: `${selectedFile.name} has been successfully uploaded`,
                // });

                // Simulating file upload progress
                const simulateUploadProgress = () => {
                    let progress = 0;
                    const interval = setInterval(() => {
                        if (progress < 100) {
                            progress += 10;
                            // setUploadProgress(progress);
                        } else {
                            clearInterval(interval);
                        }
                    }, 500);
                };
                simulateUploadProgress();
            } catch (error) {
                console.error("Error converting file to base64:", error);

                // toast.error('File Conversion Failed', {
                //     description: 'Unable to convert file to base64',
                // });
            }
        } else {
            console.error(`File should be no larger than ${maxFileLimit} MB and of type ${acceptTypes.join(', ')}`);
            // toast.error('Invalid File', {
            //     description: `File should be no larger than ${maxFileLimit} MB and of type ${acceptTypes.join(', ')}`,
            // });
        }
    };

    return (
        <div className="relative flex items-center">
            <File className="absolute left-3 text-slate-500" size={18} strokeWidth={1.5} />
            <Input
                type="file"
                accept={acceptTypes.join(', ')}
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="pl-10"
            />
        </div>


    );
};

export default FileUpload;
