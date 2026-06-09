import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], data.user);
      navigate("/onboarding");
    },
  });

  return {
    signupMutation: mutate,
    isPending,
    error,
  };
};

export default useSignUp;