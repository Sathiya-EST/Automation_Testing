
interface TableProps {
    columns: string[];
    data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
    return (
        <section className="relative rounded-md border overflow-hidden max-h-[50vh]">
            <table className="min-w-full table-auto">
                {/* Table Header */}
                <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200 bg-white overflow-y-auto block max-h-[calc(50vh-48px)]">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 text-sm text-gray-800">
                                    {row[column.toLowerCase()]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>

    );
};

export default Table;
