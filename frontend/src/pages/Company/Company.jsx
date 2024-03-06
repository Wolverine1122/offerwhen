import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OnlineAssessment from "./OnlineAssessment/OnlineAssessment";
import { fetchCompany } from "../../Api";
import "./company.css";

const Company = () => {
  const { id } = useParams();

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ["companies", id],
    queryFn: () => fetchCompany(id),
  });

  let logoBase64 = null;
  if (data && data.logo) {
    const bytes = new Uint8Array(data.logo.data);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    logoBase64 = "data:image/png;base64," + btoa(binary);
  }

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Company not found</div>}
      {isSuccess && (
        <div className="company">
          <div className="basic-info">
            <div className="logo">
              {data.logo && <img src={logoBase64} alt={data.name} />}
            </div>
            <div className="company-info">
              <h1>
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  {data.name}
                </a>
              </h1>
              <p className="company-about">{data.about}</p>
            </div>
          </div>
          <OnlineAssessment company={id} />
        </div>
      )}
    </>
  );
};

export default Company;
