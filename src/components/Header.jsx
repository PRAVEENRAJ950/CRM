import { logout } from "../auth/authService";
import { useNavigate } from "react-router-dom";

const Header = ({ title = "CRM Dashboard" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                
    navigate("/customer-login");
  };

  return (
    <div className="header">
      <h1>{title}</h1>
      <button className="add-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
