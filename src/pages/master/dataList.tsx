import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { BreadcrumbItemType, FileUploadData, GetReqParams } from '@/types/data';
import ModuleList from './components/ModuleList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertCircleIcon, AlertTriangle, Download, Eye, FileDown, FileSpreadsheet, FileX2, Plus } from 'lucide-react';
import { useGetModuleMutation } from '@/store/services/master/module';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { useGetFormListColumnsQuery, useGetFormListDataQuery } from '@/store/services/master/form';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import Spinner from '@/components/shared/Spinner';
import Text from '@/components/shared/Text';
import SearchInput from '@/components/shared/Search';
import AdvancedTable from '@/components/shared/Table';
import FileUploader from './components/CSVFileUpload';
import CSVUploadIcon from '@/assets/fileUpload';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { downLoadCSVTemplate, exportAsExcel, uploadCSV } from '@/utils/useCSVDownload';
import { MASTER_API } from '@/constants/api.constants';
import { AlertDialogFooter } from '@/components/ui/alert-dialog';

interface MasterColumns {
  displayName: string;
  formDescription: string;
  formName: string;
  isPublished: boolean
}

const DataList: React.FC = () => {

  const [getModule, { data, error: moduleError, isLoading: moduleLoading }] = useGetModuleMutation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState([
    { key: 'createdOn', order: 'ASC' }
  ]);
  const [filters, setFilters] = useState([]);
  const [requestParams, setRequestParams] = useState<GetReqParams>({
    pageNo: 1,
    pageSize: 10,
    sort: [],
    filters: selectedForm
      ? [
        {
          key: "moduleName",
          operator: "EQUAL",
          field_type: "STRING",
          value: selectedForm,
        },
      ]
      : [],
  });

  const updatedRoutes: BreadcrumbItemType[] = useMemo(() => [
    { type: 'link', title: 'Master', path: UI_ROUTES.MASTER, isActive: false },
    { type: 'page', title: 'Data', isActive: true },
  ], []);

  useBreadcrumb(updatedRoutes);

  const { data: formRecords, error: recordError, isLoading: recordLoading } = useGetFormListDataQuery({
    reqParams: requestParams,
    formName: selectedForm && selectedForm || '',
  });

  const { data: formColumnData } = useGetFormListColumnsQuery({ formName: selectedForm && selectedForm || '' });

  const updatedColumns = useMemo(() => {
    if (!formColumnData) return [];

    const columns = [...formColumnData.columnData];

    columns.push({
      accessorKey: 'action',
      header: 'Action',
      cell: (info: any) => {
        const formName = info.row.original.default_id_pk;
        return (
          <Button
            variant="default"
            className="text-white text-[10px] h-[32px] rounded flex items-center justify-center px-4 py-1 border-none"
            onClick={formName ? () => handleView(formName) : undefined}
          >
            <Eye className="w-4 h-4" />
            View
          </Button >
        )
      }
    });
    return columns;
  }, [formColumnData]);
  const onRequestParamsChange = (updatedParams: Partial<GetReqParams>) => {
    setRequestParams((prevParams) => ({
      ...prevParams,
      ...updatedParams,
    }));
  };

  const handleFormSelect = useCallback((formName: string, moduleName: string) => {
    setSelectedForm(formName);
    setSelectedModule(moduleName);
    console.log(formName, moduleName);
  }, [])
  const fetchModules = useCallback(async () => {
    try {
      await getModule({ pageNo, pageSize, sort, filters });
    } catch (err) {
      toast({
        title: "Error Fetching Modules",
        description: "Failed to load modules. Please refresh the page.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Retry"
            onClick={fetchModules}
          >
            Retry
          </ToastAction>
        ),
      });
      console.error('Failed to fetch modules', err);
    }
  }, [getModule, pageNo, pageSize, sort, filters, toast]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);
  const handleView = (formId: string) => {
    navigate(UI_ROUTES.MASTER_DATA_CRUD, { state: { formName: selectedForm, selectedModule, formId } });
  };

  const handleCreate = () => {
    navigate(`${UI_ROUTES.MASTER_DATA_CREATE}`, { state: { formName: selectedForm, selectedModule } });
  };

  const handleAddFilter = (key: string, operator: 'LIKE' | 'EQUAL', field_type: 'STRING' | 'BOOLEAN', value: string | boolean) => {
    setRequestParams((prevParams) => {
      const existingFilterIndex = prevParams.filters.findIndex(filter => filter.key === key);

      if (existingFilterIndex !== -1) {
        const updatedFilters = [...prevParams.filters];
        updatedFilters[existingFilterIndex] = {
          ...updatedFilters[existingFilterIndex],
          value,
        };

        return {
          ...prevParams,
          filters: updatedFilters,
        };
      }

      return {
        ...prevParams,
        filters: [
          ...prevParams.filters,
          { key, operator, field_type, value },
        ],
      };
    });
  };

  const handleSearch = (query: string) => {
    const key = 'default_search_criteria';
    const operator = 'LIKE';
    const field_type = 'STRING';
    const value = query;

    handleAddFilter(key, operator, field_type, value);
  };
  const renderErrorAlert = (errorMessage: string) => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {errorMessage}
      </AlertDescription>
    </Alert>
  );

  const handleFileUpload = async (fileData: FileUploadData) => {
    const uploadResult = await uploadCSV(fileData);
    if (!uploadResult.success) {
      toast({
        title: "Bulk Upload Error",
        description: (
          <>
            <p>{uploadResult.message}</p>
            <br />
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(uploadResult.downloadLink, '_blank')}
            >
              Download Error Report
            </Button>
          </>
        ),
        variant: "destructive",
        action: (
          <ToastAction
            altText="Retry"
            onClick={() => fetchModules()}
          >
            Retry
          </ToastAction>
        ),
      });
    } else {
      console.log('File uploaded successfully!');
    }
  };

  const handleExportFormRecord = () => {

    const exportAsExcelUrl = `${MASTER_API.EXPORT_AS_EXCEL}?formName=${selectedForm}`
    const params = {
      pageNo: 1,
      pageSize: formRecords?.totalRecords ?? 5,
      filters: filters ?? [],
      sort: []
    }
    const defaultFileName = `${formColumnData?.data.displayName}.xlsx`;

    exportAsExcel(exportAsExcelUrl, params, defaultFileName)

  };
  const handleDownloadTemplate = () => {
    const defaultDwldTemplateFileName = `${formColumnData?.data.displayName}.csv`;
    const downloadCSVFileUrl = `${MASTER_API.DOWNLOAD_CSV}?formName=${selectedForm}`
    downLoadCSVTemplate(downloadCSVFileUrl, defaultDwldTemplateFileName)
  };

  return (
    <div>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg border flex"
      >
        {/* First Panel (Module List) */}
        <ResizablePanel defaultSize={20} className="h-full flex-grow">
          {moduleLoading ? (
            <Spinner />
          ) : moduleError ? (
            renderErrorAlert("Failed to load modules")
          ) : data ? (
            <ModuleList
              data={data.data}
              // handleModuleSelect={handleModuleClick}
              handleFormSelect={handleFormSelect}
            // showForm={true}
            />
          ) : (
            <div>No modules available.</div>
          )}
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Second Panel (Form/Detail View) */}
        <ResizablePanel defaultSize={80} className="h-full bg-background flex-grow">
          <Dialog>
            <DialogContent>
              <DialogHeader >
                <DialogTitle>Bulk Import / Export</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <>
                <Button
                  variant="default"
                  className="rounded text-white flex space-x-2"
                  onClick={handleExportFormRecord}
                >
                  <FileDown />
                  Export As Excel
                </Button>
                <Button
                  variant="outline"
                  className="rounded flex space-x-2"
                  onClick={handleDownloadTemplate}
                >
                  <Download />
                  Download Template
                </Button>
                <Separator />
                <Text className='text-md font-semibold'>Import CSV : </Text>
                <FileUploader
                  acceptedFileTypes={['.csv']}
                  title="CSV Uploader"
                  onFileUpload={handleFileUpload}
                />
                <Alert className="flex items-center p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <AlertCircleIcon className="w-5 h-5" color='red' />
                  <div className="flex-1">
                    <AlertTitle className="text-sm font-semibold text-red-700">Bulk Upload Error</AlertTitle>
                    <AlertDescription className="text-xs text-red-600">
                      Some data requires corrections.
                      <span className="font-medium"> Download the error report</span>, fix issues, and re-upload.
                    </AlertDescription>
                  </div>
                  <Button className="bg-red-500 hover:bg-red-600 text-white pl-3">
                    Download
                  </Button>
                </Alert>


              </>
            </DialogContent>
            <div className="p-4 space-y-1 bg-card ">
              <Text className="text-lg font-bold">{selectedModule} - {formColumnData?.data.displayName}</Text>
              <div className="flex items-center space-x-4">
                <SearchInput
                  onSearch={(query: string) => handleSearch(query)}
                  className="flex-1"
                />
                <DialogTrigger asChild>
                  <button type='button' className='px-3 py-2 border rounded hover:bg-slate-200'>
                    <CSVUploadIcon className='dark:fill-white light:bg-gray-700' />
                  </button>
                </DialogTrigger>
                <Button
                  variant="default"
                  className="rounded text-white"
                  onClick={handleCreate}
                >
                  <Plus size={18} strokeWidth={3} />
                  {t('master.data.formData.list.createBtn')}
                </Button>
              </div>
              <div className="pt-1">
                {/* Error Handling for Form Data */}
                {recordError && renderErrorAlert("Failed to load form data")}

                {recordLoading && <Spinner />}

                {formRecords && formColumnData && formRecords.data && formColumnData.columnData ? (
                  <AdvancedTable<MasterColumns>
                    columns={updatedColumns ?? []}
                    data={formRecords.data}
                    totalCount={formRecords?.totalRecords || 5}
                    requestParams={requestParams}
                    onRequestParamsChange={onRequestParamsChange}
                  />
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Data</AlertTitle>
                    <AlertDescription>
                      No Data found for the selected Form Name.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </Dialog>

        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DataList;