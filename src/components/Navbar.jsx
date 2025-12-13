import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="navbar">
      <nav>
        <NavLink to="/home" end>
          <div className="nav-icon-container">
            <i class="fa-solid fa-house" ></i>
          </div>
        </NavLink>
        <NavLink to="/add">
          <div className="nav-icon-container">
            <i class="fa-solid fa-plus"></i>
          </div>
        </NavLink>
        <NavLink to="/wardrobe">
          <div className="nav-icon-container">
            <i class="fa-solid fa-shirt"></i>
          </div>
        </NavLink>
      </nav>
    </div>
  );
}