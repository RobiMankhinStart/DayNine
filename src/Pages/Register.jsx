import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserCreation } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Regex patterns
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must have uppercase, lowercase, number & special char";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await UserCreation.RegisterUser(formData);
      console.log("register res : ", res);

      toast.success("Registration successful!");

      // storing api tokens if it returns any
      if (res?.data?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);
      }

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      //  navigating
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 ">
      <div className=" max-w-md mx-auto rounded-xl shadow-lg p-6 bg-white shadow-emerald-500">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <form onSubmit={handleSubmit}>
          {/*.............. Username ..................*/}
          <div className="mb-3">
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-blue-500"
            />
            {errors.username && (
              <p className="text-red-600 text-sm">{errors.username}</p>
            )}
          </div>

          {/* .........Email .....................*/}
          <div className="mb-3">
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-blue-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          {/* ..................................Password.................. */}
          <div className="mb-3">
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-blue-500"
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          {/* ...........................Confirm Password ...........................*/}
          <div className="mb-3">
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit button with loader */}
          <button
            type="submit"
            disabled={loading}
            className="text-xl font-bold mx-auto flex items-center justify-center w-32 h-12 rounded bg-emerald-600 text-white relative overflow-hidden group z-10 hover:text-white duration-1000"
          >
            {loading ? (
              <TailSpin height={25} width={25} color="#fff" />
            ) : (
              <>
                <span className="absolute bg-emerald-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"></span>
                <span className="absolute bg-emerald-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"></span>
                Register
              </>
            )}
          </button>
        </form>
        <div className="text-lg font-mono flex items-center justify-center gap-1 mt-5">
          <h3>Already have an Account?</h3>
          <Link className="text-blue-600" to={"/login"}>
            Log in
          </Link>
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
};

export default Register;
