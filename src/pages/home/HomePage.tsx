import { routes } from "@/shared/configs/routes";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      Home
      <Button
        onClick={() => {
          navigate(routes.ABOUT);
        }}
      >
        button
      </Button>
    </>
  );
};
