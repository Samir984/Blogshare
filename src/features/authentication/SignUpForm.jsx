import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "./../../services/auth";
import { useDispatch } from "react-redux";
import { signIn } from "../authslice";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
function SignUpForm() {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async function (data) {
    const { email, password, username } = data;
    setIsSubmitting(true);
    try {
      const userData = await authService.createAccount(
        email,
        password,
        username
      );
      toast.success("Account Created Successfully");
      reset();
      if (userData) {
        const currentUserData = await authService.getCurrentUser();
        if (currentUserData) {
          dispatch(signIn(currentUserData));
        }
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const onError = function (errors) {
    // console.log(errors);
  };

  return (
    <div className="flex flex-col gap-2 w-80 self-center mt-3">
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Input
          type="text"
          error={errors.username?.message}
          className="w-full p-1"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
        />

        <Input
          type="text"
          error={errors.email?.message}
          className="w-full p-1 mt-3"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please provide a valid email address",
            },
          })}
        />

        <Input
          type="password"
          className="w-full p-1 mt-3"
          error={errors.password?.message}
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            validate: (fieldValue) => {
              return fieldValue.length < 8
                ? "Password must be at least 8 character long"
                : true;
            },
          })}
        />

        <button
          type="submit"
          className="p-2 bg-blue-700 text-white font-semibold hover:bg-blue-800 mt-6 rounded w-full"
        >
          {isSubmiting ? <span className="loader"></span> : "Create Account"}
        </button>
      </form>

      <h2 className="mt-2 text-center text-lg font-medium">
        Already have an account?&nbsp;
        <Link to="/signin" className="hover:underline active:underline">
          Sign in
        </Link>
      </h2>
    </div>
  );
}

export default SignUpForm;
