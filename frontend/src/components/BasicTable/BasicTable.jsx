import { useMemo } from "react";
import propTypes from "prop-types";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import { COLUMNS } from "./columns";
import "./basic-table.css";


const BasicTable = (props) => {
  const {company_data} = props;
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => company_data, []);

  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    page, 
    nextPage, 
    previousPage, 
    canNextPage, 
    canPreviousPage, 
    pageOptions, 
    gotoPage, 
    pageCount, 
    setPageSize, 
    state, 
    prepareRow, 
    selectedFlatRows 
  } = useTable({ columns, data }, useSortBy, usePagination, useRowSelect, (hooks) => {
    hooks.visibleColumns.push((columns) => {
      return [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          )
        },
        ...columns
      ]
    })
  });
  const { pageIndex, pageSize } = state;

  // TODO: server side pagination and sorting needed

  return (
    <>
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
              <span>
                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
              </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {
          page.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {
                  row.cells.map((cell) => {
                    return <td key={cell.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
    
    <div>
      <span>
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
      </span>

      <span>
        | Go to page:{' '}
        <input type="number" defaultValue={pageIndex + 1} min={"1"} max={pageCount} onChange={e => {
          let pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
          pageNumber = Math.min(Math.max(pageNumber, 0), pageCount - 1);
          gotoPage(pageNumber)
        }} style={{ width: '50px' }} />
      </span>

      <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
        {
          [5, 10, 25, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))
        }
      </select>

      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>Prev</button>
      <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
    </div>

    <pre>
        <code>
          {JSON.stringify(
            {
              selectedFlatRows: selectedFlatRows.map((row) => row.original),
            },
            null,
            2
          )}
        </code>
      </pre>
    </>
  )
}

BasicTable.propTypes = {
  company_data: propTypes.array.isRequired,
  getToggleAllRowsSelectedProps: propTypes.func,
  getToggleRowSelectedProps: propTypes.func,
  row: propTypes.object,
}

export default BasicTable;