import { useParams } from 'react-router-dom';
import './company.css'

const Company = () => {
  const { id } = useParams();
  return (
    <>
      <h1>Company {id}</h1>
    </>
  )
}

export default Company;