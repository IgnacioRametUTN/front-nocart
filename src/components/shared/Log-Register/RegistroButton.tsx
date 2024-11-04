import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { BsBoxArrowInUp } from "react-icons/bs";


const RegistroButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      variant="secondary"
      className="mx-2 my-2"
      size="sm"
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: "/",
          },
          authorizationParams: {
            screen_hint: "signup",
          },
        })
      }
    >
      <BsBoxArrowInUp /> Register
    </Button>
  );
};

export default RegistroButton;
