import { NavLink } from 'react-router-dom';
import { NAV_ICON, FAIcon } from '../icons/fa';

export default function Navbar() {
  return (
    <div className="navbar">
      <nav>
        <NavLink to="/home" end>
          <div className="nav-icon-container">
            <FAIcon icon={NAV_ICON.home} />
          </div>
        </NavLink>
        <NavLink to="/add">
          <div className="nav-icon-container">
            <FAIcon icon={NAV_ICON.add} />
          </div>
        </NavLink>
        <NavLink to="/wardrobe">
          <div className="nav-icon-container">
            <FAIcon icon={NAV_ICON.wardrobe} />
          </div>
        </NavLink>
      </nav>
    </div>
  );
}