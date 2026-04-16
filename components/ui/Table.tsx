interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

const Table = ({ headers, children, className = '' }: TableProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;