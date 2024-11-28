import AdvancedTable, { TableRequestParams } from '@/components/shared/Table';
import React, { useState, useEffect } from 'react';

interface MyData {
  id: number;
  name: string;
  age: number;
  country: string;
}

const MyTableComponent = () => {
  // State for the table data and request parameters
  const [data, setData] = useState<MyData[]>([
    { "id": 1, "name": "John Doe", "age": 28, "country": "USA" },
    { "id": 2, "name": "Jane Smith", "age": 34, "country": "UK" },
    { "id": 3, "name": "Sam Wilson", "age": 22, "country": "Canada" }
  ]);
  const [totalCount, setTotalCount] = useState(0);
  const [requestParams, setRequestParams] = useState<TableRequestParams>({
    pageNo: 1,
    pageSize: 10,
    sort: [{ key: 'name', order: 'ASC' }],
    filters: [],
  });

  const fetchData = async () => {
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(requestParams),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    // setData(result.data);
    setTotalCount(result.totalCount);
  };

  const handleRequestParamsChange = (newParams: TableRequestParams) => {
    setRequestParams(newParams);
  };

  useEffect(() => {
    fetchData();
  }, [requestParams]); 

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'age',
      header: 'Age',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
  ];

  return (
    <div className="my-8">
      <AdvancedTable<MyData>
        columns={columns}
        data={data}
        totalCount={totalCount}
        requestParams={requestParams}
        onRequestParamsChange={handleRequestParamsChange}
      />
    </div>
  );
};

export default MyTableComponent;
