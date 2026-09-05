import { routes } from "@/shared/configs/routes";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      Home
      <button
        onClick={() => {
          navigate(routes.ABOUT);
        }}
      >
        button
      </button>
    </>
  );
};
