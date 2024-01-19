import { useSearchParams } from "react-router-dom";
import "./companies.css";

const Companies = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    search: "",
    location: "",
    full_time: false,
    page: 1,
  });
  let search = searchParams.get("search");
  return (
    <>
      <h1>Companies</h1>
      <input
        type="text"
        value={search}
        placeholder="Search"
        onChange={(e) => setSearchParams({ search: e.target.value })}
      />
    </>
  );
};

export default Companies;
