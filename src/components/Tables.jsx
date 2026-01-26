/**
 * Reusable Table Components
 * Common table components for displaying data
 */

import React from 'react';

/**
 * Generic Table Component
 * @param {Object} props - Component props
 * @param {Array} props.columns - Column definitions
 * @param {Array} props.data - Table data
 * @param {Function} props.onEdit - Edit handler function
 * @param {Function} props.onDelete - Delete handler function
 * @param {boolean} props.canEdit - Whether edit is allowed
 * @param {boolean} props.canDelete - Whether delete is allowed
 */
export const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(canEdit || canDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row._id || index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {(canEdit || canDelete) && (
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {canEdit && onEdit && (
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => onEdit(row)}
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && onDelete && (
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => onDelete(row)}
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
  );
};

/**
 * Status Badge Component
 * @param {string} status - Status value
 * @param {Object} statusMap - Status to color mapping
 */
export const StatusBadge = ({ status, statusMap = {} }) => {
  const defaultMap = {
    New: 'badge-info',
    Active: 'badge-success',
    Pending: 'badge-warning',
    Completed: 'badge-success',
    Cancelled: 'badge-danger',
    Lost: 'badge-danger',
    Qualified: 'badge-success',
    Contacted: 'badge-info',
  };

  const badgeClass = statusMap[status] || defaultMap[status] || 'badge-info';

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};

export default DataTable;
