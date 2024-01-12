import { Link, Outlet } from 'react-router-dom';
import './navbar.css'

const Navbar = () => {
  return (
    <>
      <h1>Navbar</h1>
      <Link to = "/">Home</Link>
      <br />
      <Link to = "/about">About</Link>
      <br />
      <Link to = "/companies">Companies</Link>
      <Outlet />
    </>
  )
}

export default Navbar;