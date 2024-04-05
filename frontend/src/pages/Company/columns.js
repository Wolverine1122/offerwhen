import { format } from "date-fns";

const COLUMNS = [
  {
    Header: "Date",
    accessor: "assessment_date",
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
    Header: "Platform",
    accessor: "assessment_platform",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Season",
    accessor: "season_id",
  }
];

export default COLUMNS;