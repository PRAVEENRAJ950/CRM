import { logoutUser } from "../auth/fakeAuth";
import { useNavigate } from "react-router-dom";

const Header = ({ title = "CRM Dashboard" }) => {
  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="header">
      <h1>{title}</h1>
      <button className="add-btn" onClick={logout}>Logout</button>
    </div>
  );
};

export default Header;
