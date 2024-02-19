import { useMemo, useCallback, useEffect } from "react";
import propTypes from "prop-types";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import "./basic-table.css";
import Checkbox from "../Checkbox/Checkbox";

const BasicTable = ({
  column_struct,
  company_data,
  onSelectedRows,
  manualPagination = false,
}) => {
  const columns = useMemo(() => column_struct, []);
  const data = useMemo(() => company_data, []);

  const getRowId = useCallback((row) => {
    return row.assessment_id;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    { columns, data, manualPagination, getRowId },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <Checkbox {...getToggleAllPageRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <Checkbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ];
      });
    },
  );

  useEffect(() => {
    onSelectedRows(selectedRowIds);
  }, [selectedRowIds, onSelectedRows]);

  return (
    <div className="table-section">
      <table className="content-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                {...row.getRowProps()}
                className={row.isSelected ? "selected" : ""}
              >
                {row.cells.map((cell) => {
                  return (
                    <td key={cell.id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

BasicTable.propTypes = {
  company_data: propTypes.array.isRequired,
  column_struct: propTypes.array.isRequired,
  manualPagination: propTypes.bool,
  onSelectedRows: propTypes.func.isRequired,
  getToggleAllPageRowsSelectedProps: propTypes.func,
  getToggleRowSelectedProps: propTypes.func,
  row: propTypes.object,
};

export default BasicTable;
