import { format } from "date-fns";

export const COLUMNS = [
  {
    Header: "Date",
    accessor: "date",
    Cell: ({ value }) => {
      return format(new Date(value), "dd/MM/yyyy");
    },
  },
  {
    Header: "Scored",
    accessor: "scored",
  },
  {
    Header: "Total",
    accessor: "max_score",
    disableSortBy: true,
  },
  {
    Header: "Status",
    accessor: "status",
  },
];
