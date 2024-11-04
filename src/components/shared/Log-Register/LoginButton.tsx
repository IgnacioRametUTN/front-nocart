import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { BsBoxArrowInRight } from "react-icons/bs";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="primary"
      className="mx-2 my-2"
      size="sm"
      onClick={() => {
        loginWithRedirect({
          appState: {
            returnTo: "/",
          },
          
        });
      }}
    >
      <BsBoxArrowInRight /> Login
    </Button>
  );
};

export default LoginButton;
