import React, { useState } from 'react';

const DataTable = ({ 
  columns, 
  data, 
  title, 
  onEdit, 
  onDelete, 
  onAdd,
  itemsPerPage = 10, 
  searchable = true 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate pagination
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  // Filter data based on search term
  const filteredData = searchable
    ? data.filter((item) =>
        Object.values(item).some(
          (val) => 
            val !== null && 
            val !== undefined && 
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Get current items
  const currentItems = filteredData.slice(firstIndex, lastIndex);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-2">
          {searchable && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="w-5 h-5 absolute right-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add New
            </button>
          )}
        </div>
      </div>

      {currentItems.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No data found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(item) 
                        : item[column.key] !== undefined && item[column.key] !== null 
                          ? item[column.key].toString() 
                          : ''}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {firstIndex + 1} to {Math.min(lastIndex, filteredData.length)} of{' '}
            {filteredData.length} results
          </div>
          <div className="flex">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              } px-3 py-1 border border-gray-300 rounded-l focus:outline-none`}
            >
              Previous
            </button>
            {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map(
              (_, i) => {
                // Show limited page numbers
                if (
                  i === 0 ||
                  i === Math.ceil(filteredData.length / itemsPerPage) - 1 ||
                  (i >= currentPage - 2 && i <= currentPage + 0)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600 hover:bg-blue-50'
                      } px-3 py-1 border border-gray-300 focus:outline-none`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (
                  i === currentPage - 3 ||
                  i === currentPage + 1
                ) {
                  return (
                    <button
                      key={i}
                      className="px-3 py-1 border border-gray-300 bg-white text-gray-500 focus:outline-none"
                      disabled
                    >
                      ...
                    </button>
                  );
                }
                return null;
              }
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
              className={`${
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              } px-3 py-1 border border-gray-300 rounded-r focus:outline-none`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;