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

        if (response.status === 400) {
            const errorData = await response.json();
            console.log(errorData);

            if (errorData.validationMessage && errorData.data) {
                return {
                    success: false,
                    statusCode: errorData.httpStatusCode,
                    message: errorData.validationMessage.data,
                    downloadLink: errorData.data,
                };
            }
            throw new Error('Validation error occurred, but no download link found.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData?.message || 'Unknown error'}`);
        }
        return { success: true };

    } catch (err) {
        console.error('Error:', err);
        throw new Error('Failed to upload the file. Please try again.');
    }
};

export const dwldErrReport = async (formName: string) => {
    try {
        const accessToken = getToken('accessToken');
        const response = await fetch(`${MASTER_API.DWLD_ERR_REPORT}?formName=${formName}`, {
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
        let dynamicFilename = filenameMatch ? filenameMatch[1] : formName;

        // Ensure the file has a .csv extension
        if (!dynamicFilename.endsWith('.csv')) {
            dynamicFilename += '.csv';
        }

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
        throw new Error('Failed to download the error report. Please try again.');
    }
};
