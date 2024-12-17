// import { useState, useCallback } from 'react';
// import { getToken } from '@/utils/securels';

// interface SortOption {
//     key: string;
//     order: 'ASC' | 'DESC';
// }

// interface Filter {
//     key: string;
//     operator: 'EQUAL' | 'LIKE';
//     value: string | boolean;
//     field_type: 'BOOLEAN' | 'STRING';
// }

// export interface GetReqParams {
//     pageNo: number;
//     pageSize: number;
//     sort: SortOption[];
//     filters: Filter[];
// }

// interface UseFileDownloadReturn {
//     downloadFile: (params: GetReqParams) => Promise<void>;
//     loading: boolean;
//     error: Error | null;
// }

// const useFileDownload = (apiUrl: string, defaultFilename: string = 'default_filename.xlsx'): UseFileDownloadReturn => {
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<Error | null>(null);

//     const downloadFile = useCallback(async (params: GetReqParams): Promise<void> => {
//         setLoading(true);
//         setError(null);

//         try {
//             const accessToken = getToken('accessToken');

//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${accessToken}`,
//                 },
//                 body: JSON.stringify(params),
//             });
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const contentDisposition = response.headers.get('content-disposition');

//             const filenameMatch = contentDisposition?.match(/filename="(.+?)"/);
//             const dynamicFilename = filenameMatch ? filenameMatch[1] : defaultFilename;

//             const blob = await response.blob();

//             if (!blob || blob.size === 0) {
//                 throw new Error('Empty file received.');
//             }

//             const dataUrl = window.URL.createObjectURL(blob);
//             const downloadLink = document.createElement('a');
//             downloadLink.href = dataUrl;
//             downloadLink.download = dynamicFilename;

//             document.body.appendChild(downloadLink);
//             downloadLink.click();

//             document.body.removeChild(downloadLink);
//             window.URL.revokeObjectURL(dataUrl);

//         } catch (err) {
//             setError(err instanceof Error ? err : new Error('An unknown error occurred'));
//             console.error('Error:', err);
//         } finally {
//             setLoading(false);
//         }
//     }, [apiUrl, defaultFilename]);

//     // const getDefaultFilenameFromUrl = (url: string, fallbackFilename: string): string => {
//     //     const urlSegments = url.split('/');
//     //     const filename = urlSegments[urlSegments.length - 1];
//     //     const extension = '.xlsx';
//     //     return filename || fallbackFilename;
//     // };

//     return { downloadFile, loading, error };
// };

// export default useFileDownload;
import { MASTER_API } from '@/constants/api.constants';
import { GetReqParams } from '@/types/data';
import { getToken } from '@/utils/securels';

// Helper function for downloading files
export const exportAsExcel = async (apiUrl: string, params: GetReqParams, defaultFilename = 'default_filename.xlsx') => {
    try {
        const accessToken = getToken('accessToken');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentDisposition = response.headers.get('content-disposition');
        const filenameMatch = contentDisposition?.match(/filename="(.+?)"/);
        const dynamicFilename = filenameMatch ? filenameMatch[1] : defaultFilename;

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
            throw new Error('Empty file received.');
        }

        const dataUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = dynamicFilename;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(dataUrl);

    } catch (err) {
        console.error('Error:', err);
        throw new Error('Failed to download the file. Please try again.');
    }
};

export const downLoadCSVTemplate = async (apiUrl: string, defaultFilename = 'default_filename.xlsx') => {
    try {
        const accessToken = getToken('accessToken');

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentDisposition = response.headers.get('content-disposition');
        const filenameMatch = contentDisposition?.match(/filename="(.+?)"/);
        const dynamicFilename = filenameMatch ? filenameMatch[1] : defaultFilename;

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
            throw new Error('Empty file received.');
        }

        const dataUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = dynamicFilename;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(dataUrl);

    } catch (err) {
        console.error('Error:', err);
        throw new Error('Failed to download the file. Please try again.');
    }
}

export const uploadCSV = async (file: object) => {
    try {
        const accessToken = getToken('accessToken');
        const response = await fetch(`${MASTER_API.BULK_INSERT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(file),
        });

        // Check for HTTP status 400 (Bad Request) for validation errors
        if (response.status === 400) {
            const errorData = await response.json();
            // Check if there's a validation message and return the download link
            if (errorData.validationMessage && errorData.data) {
                return {
                    success: false,
                    message: errorData.validationMessage.data, // The validation message
                    downloadLink: errorData.data, // The download link for the error report
                };
            }
            throw new Error('Validation error occurred, but no download link found.');
        }

        // If the status code is not 400 (i.e., no validation error), throw an error with the message from the response
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData?.message || 'Unknown error'}`);
        }

        // If the upload is successful, return success
        return { success: true };

    } catch (err) {
        console.error('Error:', err);
        throw new Error('Failed to upload the file. Please try again.');
    }
};
