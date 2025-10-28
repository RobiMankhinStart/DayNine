import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ProductApi } from "../services/practice";
import { toast } from "react-toastify";

const RegisterTwo = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Regex patterns
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "user name is required";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must have uppercase, lowercase, number & special char";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "passWord do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await ProductApi.funOne(formData);
      toast.success("success");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
        toast.error(error.response?data?.message || "Registration failed!")
    } finally {
      setLoading(false);
        
    }
  };
  return <div>RegisterTwo</div>;
};

export default RegisterTwo;
