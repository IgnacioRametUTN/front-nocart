import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { BsBoxArrowInLeft } from "react-icons/bs";
const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      variant="outline-danger"
      className="mx-2 my-2"
      size="sm"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      <BsBoxArrowInLeft />
      Logout
    </Button>
  );
};

export default LogoutButton;
