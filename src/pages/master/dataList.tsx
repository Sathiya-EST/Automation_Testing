import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { UI_ROUTES } from '@/constants/routes';
import useBreadcrumb from '@/hooks/useBreadCrumb';
import { FileUploadData, Filter, GetReqParams } from '@/types/data';
import ModuleList from './components/ModuleList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, Download, Eye, FileDown, Plus } from 'lucide-react';
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
import { downLoadCSVTemplate, dwldErrReport, exportAsExcel, uploadCSV } from '@/utils/useCSVDownload';
import { MASTER_API } from '@/constants/api.constants';
import ErrorAlert from '@/components/shared/ErrorAlert';
import FormSelectionPlaceholder from './components/FormSelectionPlaceholder';
import InfoAlert from '@/components/shared/InfoAlert';
import { useDispatch, useSelector } from 'react-redux';
import { updateMasterData } from '@/store/slice/masterSlice';
import { RootState } from '@/store';

interface MasterColumns {
  displayName: string;
  formDescription: string;
  formName: string;
  isPublished: boolean
}

const DataList: React.FC = () => {

  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [getModule, { data: moduleData, error: moduleError, isLoading: moduleLoading }] = useGetModuleMutation();
  const dispatch = useDispatch();
  const activeForm = useSelector((state: RootState) => state.master.data?.formName);
  const activeModule = useSelector((state: RootState) => state.master.data?.moduleName);
  const [isExporting, setIsExporting] = useState(false);
  const [moduleSearchVal, setModuleSearchVal] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>(activeModule || "");
  const [selectedForm, setSelectedForm] = useState<string>(activeForm || "");
  const [isDwldErrReport, setIsDwldErrReport] = useState<boolean>(false)
  const [moduleReqParams, setModuleReqParams] = useState<GetReqParams>({
    pageNo: 1,
    pageSize: 10,
    sort: [{ key: "createdOn", order: "ASC" }],
    filters: [],
  });
  const [formReqParams, setFormReqParams] = useState<GetReqParams>({
    pageNo: 1,
    pageSize: 10,
    sort: [],
    filters: [],
  });

  // Breadcrumbs
  useBreadcrumb(
    useMemo(
      () => [
        { type: 'link', title: 'Master', path: UI_ROUTES.MASTER_DATA, isActive: false },
        { type: 'page', title: 'Data', isActive: true },
      ],
      []
    )
  );

  const { data: formRecords, error: recordError, isLoading: recordLoading, refetch: formRecordsRefetch } = useGetFormListDataQuery({
    reqParams: formReqParams,
    formName: selectedForm && selectedForm || '',
  });

  useEffect(() => {
    formRecordsRefetch();
  }, [formRecordsRefetch, formReqParams]);

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
            {t('master.data.formData.list.viewBtn')}
          </Button >
        )
      }
    });
    return columns;
  }, [formColumnData]);
  const onFormRequestParamsChange = (updatedParams: Partial<GetReqParams>) => {
    setFormReqParams((prevParams) => ({
      ...prevParams,
      ...updatedParams,
    }));
  };

  const handleFormSelect = useCallback((formName: string, moduleName: string) => {
    setSelectedForm(formName);
    setSelectedModule(moduleName);
    setFormReqParams({
      pageNo: 1,
      pageSize: 10,
      sort: [],
      filters: [],
    })
    dispatch(updateMasterData({
      formName,
      moduleName
    }));
  }, [dispatch])

  useEffect(() => {
    (async () => {
      try {
        await getModule(moduleReqParams);
      } catch (err) {
        console.log("Download Error Report");
      }
    })();
  }, [getModule, moduleReqParams, toast]);


  const handleView = (formId: string) => {
    navigate(UI_ROUTES.MASTER_DATA_CRUD, { state: { formName: selectedForm, selectedModule, formId } });
  };

  const handleCreate = () => {
    navigate(`${UI_ROUTES.MASTER_DATA_CREATE}`, { state: { formName: selectedForm, selectedModule } });
  };

  const handleAddFormFilter = (key: string, operator: 'LIKE' | 'EQUAL', field_type: 'STRING' | 'BOOLEAN', value: string | boolean) => {
    setFormReqParams((prevParams) => {
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

    handleAddFormFilter(key, operator, field_type, value);
  };

  const handleFileUpload = async (fileData: FileUploadData) => {
    const uploadResult = await uploadCSV(fileData);
    setIsDwldErrReport(false)
    if (!uploadResult.success) {
      toast({
        title: t('master.data.formData.list.noData'),
        description: (
          <>
            <p>{uploadResult.message}</p>
            <br />
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(uploadResult.downloadLink, '_blank')}
            >
              {t('master.data.formData.list.dwldErrReport')}
            </Button>
          </>
        ),
        variant: "destructive",
        action: (
          <ToastAction
            altText="Retry"
            onClick={() => getModule(moduleReqParams)}
          >
            {t('master.data.formData.list.retry')}
          </ToastAction>
        ),
      });
    } else {
      console.log('File uploaded successfully!');
    }
    if (uploadResult.statusCode === 400) {
      setIsDwldErrReport(true)
    }
  };

  const handleExportFormRecord = async () => {
    try {
      setIsExporting(true);
      const exportAsExcelUrl = `${MASTER_API.EXPORT_AS_EXCEL}?formName=${selectedForm}`;
      const params = {
        pageNo: 1,
        pageSize: formRecords?.totalRecords ?? 5,
        filters: formReqParams?.filters ?? [],
        sort: []
      };
      const defaultFileName = `${formColumnData?.data.displayName}.xlsx`;

      await exportAsExcel(exportAsExcelUrl, params, defaultFileName);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // const handleExportFormRecord = () => {

  //   const exportAsExcelUrl = `${MASTER_API.EXPORT_AS_EXCEL}?formName=${selectedForm}`
  //   const params = {
  //     pageNo: 1,
  //     pageSize: formRecords?.totalRecords ?? 5,
  //     filters: formReqParams?.filters ?? [],
  //     sort: []
  //   }
  //   const defaultFileName = `${formColumnData?.data.displayName}.xlsx`;

  //   exportAsExcel(exportAsExcelUrl, params, defaultFileName)

  // };
  const handleDownloadTemplate = () => {
    const defaultDwldTemplateFileName = `${formColumnData?.data.displayName}.csv`;
    const downloadCSVFileUrl = `${MASTER_API.DOWNLOAD_CSV}?formName=${selectedForm}`
    downLoadCSVTemplate(downloadCSVFileUrl, defaultDwldTemplateFileName)
  };

  const handleDwldErrReport = () => {
    dwldErrReport(formColumnData?.data.displayName || '')

  }

  const handleModuleSearch = (searchVal: string) => {
    setModuleSearchVal(searchVal)
    const key = "moduleName";
    const operator = "LIKE";
    const fieldType = "STRING";

    setModuleReqParams((prev) => {
      const filters = prev.filters.filter((f) => f.key !== key);

      if (searchVal.trim() === "") {
        return {
          ...prev,
          filters,
        };
      }
      const newFilter: Filter = {
        key,
        operator,
        field_type: fieldType,
        value: searchVal,
      };

      return {
        ...prev,
        filters: [...filters, newFilter],
      };
    });
  };
  const defaultSearchFilter = formReqParams.filters.find(
    (filter) => filter.key === 'default_search_criteria'
  );

  const searchKey = typeof defaultSearchFilter?.value === 'string'
    ? defaultSearchFilter.value
    : undefined;

  const initialSearchValue = typeof defaultSearchFilter?.value === 'string'
    ? defaultSearchFilter.value
    : '';

  const { isPublished, createRow } = formColumnData?.data || {};

  const [hasViewAccess, hasCreateAccess] = [
    isPublished,
    createRow,
  ];

  return (
    <div>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full rounded-lg border flex"
      >
        {/* First Panel (Module List) */}
        <ResizablePanel defaultSize={20} className="h-full flex-grow">
          {moduleLoading && !moduleData ? (
            <Spinner />
          ) : moduleError ? (
            <ErrorAlert message={t('master.data.formData.list.moduleErr')} />
          ) : moduleData ? (
            <ModuleList
              data={moduleData.data}
              handleFormSelect={handleFormSelect}
              onPageChange={(curPage: number) => {
                setModuleReqParams((prev) => ({ ...prev, pageNo: curPage }));
              }}
              currentPage={moduleReqParams.pageNo}
              totalRecords={moduleData.totalRecords}
              itemsPerPage={moduleReqParams.pageSize}
              onSearch={handleModuleSearch}
              initialSearchVal={moduleSearchVal}
              initialActiveModule={selectedModule}
              initialActiveForm={selectedForm}
            />
          ) : (
            <div>{t('master.data.formData.list.noModules')}</div>
          )}
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle />

        {/* Second Panel (Form/Detail View) */}
        <ResizablePanel defaultSize={80} className="h-full bg-background flex-grow">
          {formColumnData ? (
            hasViewAccess ? (
              <Dialog>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{formColumnData?.data.displayName} - {t('master.data.formData.list.bulk.title')}</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <>
                    <Button
                      variant="default"
                      className="rounded text-white flex space-x-2"
                      onClick={handleExportFormRecord}
                    >
                      <FileDown />
                      {isExporting ? t('master.data.formData.list.exporting') : t('master.data.formData.list.exportAsExcel')}
                    </Button>
                    {hasCreateAccess && (
                      <>
                        <Button
                          variant="outline"
                          className="rounded flex space-x-2"
                          onClick={handleDownloadTemplate}
                        >
                          <Download />
                          {t('master.data.formData.list.bulk.dwldTemp')}
                        </Button>
                        <Separator />
                        <Text className="text-md font-semibold">{t('master.data.formData.list.bulk.importCSV')}</Text>
                        <FileUploader
                          acceptedFileTypes={['.csv']}
                          title={t('master.data.formData.list.bulk.fileUploaderTitle')}
                          onFileUpload={handleFileUpload}
                          defaultFileName={formColumnData?.data.displayName}
                        />
                        {isDwldErrReport && (
                          <Alert className="flex items-center p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                            <AlertCircleIcon className="w-5 h-5" color="red" />
                            <div className="flex-1">
                              <AlertTitle className="text-sm font-semibold text-red-700">
                                {t('master.data.formData.list.bulk.uploadErr')}
                              </AlertTitle>
                              <AlertDescription className="text-xs text-red-600">
                                {t('master.data.formData.list.bulk.uploadErr')}
                                <span className="font-medium"> {t('master.data.formData.list.bulk.dwldErr')}</span>
                              </AlertDescription>
                            </div>
                            <Button
                              className="bg-red-500 hover:bg-red-600 text-white pl-3"
                              onClick={handleDwldErrReport}
                            >
                              {t('master.data.formData.list.dwldBtn')}
                            </Button>
                          </Alert>
                        )}
                      </>
                    )}
                  </>
                </DialogContent>
                <div className="p-4 space-y-1 bg-card">
                  <Text variant="title">{formColumnData?.data.moduleName} - {formColumnData?.data.displayName}</Text>
                  <div className="flex items-center space-x-4">
                    <SearchInput
                      key={searchKey}
                      onSearch={(query: string) => handleSearch(query)}
                      className="flex-1"
                      initialValue={initialSearchValue}
                    />
                    <DialogTrigger asChild>
                      <button type="button" className="px-3 py-2 border rounded hover:bg-slate-200">
                        <CSVUploadIcon className="dark:fill-white light:bg-gray-700" />
                      </button>
                    </DialogTrigger>
                    {hasCreateAccess && (
                      <Button
                        variant="default"
                        className="rounded text-white"
                        onClick={handleCreate}
                      >
                        <Plus size={18} strokeWidth={3} />
                        {t('master.data.formData.list.createBtn')}
                      </Button>
                    )}
                  </div>
                  <div className="pt-1">
                    {recordError && <ErrorAlert message={t('master.data.formData.list.errformData')} />}
                    {recordLoading && <Spinner />}
                    {formRecords?.data && formColumnData?.columnData ? (
                      <AdvancedTable<MasterColumns>
                        columns={updatedColumns ?? []}
                        data={formRecords.data ?? []}
                        totalCount={formRecords?.totalRecords || 5}
                        requestParams={formReqParams}
                        onRequestParamsChange={onFormRequestParamsChange}
                      />
                    ) : (
                      <InfoAlert
                        title={t('master.data.formData.list.noData')}
                        desc={t('master.data.formData.list.noDatadesc')}
                      />
                    )}
                  </div>
                </div>
              </Dialog>
            ) : (
              'You don’t have access to this table'
            )
          ) : (
            <FormSelectionPlaceholder />
          )}
        </ResizablePanel>


      </ResizablePanelGroup>
    </div>
  );
};

export default DataList;