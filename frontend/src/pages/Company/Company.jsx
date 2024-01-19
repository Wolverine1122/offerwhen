import { useParams } from 'react-router-dom';
import BasicTable from '../../components/BasicTable/BasicTable';
import DUMMY_DATA from './dummy.json';
import './company.css'

const Company = () => {
  const { id } = useParams();

  const selectedCompany = DUMMY_DATA.find((company) => company.id === id);
  if (!selectedCompany) {
    return <p>Company not found!</p>
  }

  const { name, url, OA } = selectedCompany;

  return (
    <>
      <h1>{name}</h1>
      <p>{url}</p>
      <h2>OA: {OA.platform}</h2>
      <BasicTable company_data={ OA.data }/>
    </>
  )
}

export default Company;