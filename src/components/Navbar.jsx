import { Link } from 'react-router-dom';
import { Icons } from './Icons';

export default function Navbar() {
  return (
    <div className="navbar">
      <nav>
        <Link to="/home">
          <div className="nav-icon-container">
            <Icons.Home className="nav-icon" />
          </div>
        </Link>
        <Link to="/add">
          <div className="nav-icon-container nav-icon-primary">
            <Icons.Plus className="nav-icon" />
          </div>
        </Link>
        <Link to="/wardrobe">
          <div className="nav-icon-container">
            <Icons.Shirt className="nav-icon" />
          </div>
        </Link>
      </nav>
    </div>
  );
}