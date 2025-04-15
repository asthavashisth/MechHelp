import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { info } from "../assets/info";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const USER_API_END_POINT = import.meta.env.VITE_USER_API_END_POINT;

const SignUp = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);
  const [userType, setUserType] = useState("user");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    location: "",
    address: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (login) {
        const { data } = await axios.post(`${USER_API_END_POINT}login`, {
          email: formData.email,
          password: formData.password,
          userType,
        });

        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("userData", JSON.stringify(data.user));

        toast.success("Login Successful! ✅", { position: "top-center" });

        if (userType === "mechanic") {
          setTimeout(() => navigate("/mechanic-dashboard"), 1000);
        } else {
          setTimeout(() => navigate("/layout"), 1000);
        }
      } else {
        const { data } = await axios.post(`${USER_API_END_POINT}register`, {
          ...formData,
          role: userType, // ✅ Corrected key name
        });

        toast.success("Registration Successful! 🎉", { position: "top-center" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong! ❌", { position: "top-center" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-2xl p-10 flex flex-col sm:flex-row items-center max-w-5xl w-[80%]">
        <div className="hidden sm:block w-1/2">
          <img src={info[0].image} alt={info[0].name} className="w-[80%] h-[80%] object-cover rounded-lg shadow-lg" />
        </div>
        <div className="w-full sm:w-1/2 p-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-full">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="block appearance-none w-full bg-blue-700 text-white font-semibold py-3 px-6 rounded-full hover:bg-amber-400 hover:text-black cursor-pointer text-center"
              >
                <option value="user">{login ? "Login as User" : "Sign Up as User"}</option>
                <option value="mechanic">{login ? "Login as Mechanic" : "Sign Up as Mechanic"}</option>
              </select>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
            {login ? "Login" : "Sign Up"}
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!login && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                  <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                </div>
              </>
            )}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full border p-3 rounded-lg" />
            </div>
            <button className="w-full bg-blue-700 text-white font-semibold py-3 rounded-full hover:bg-amber-400 hover:text-black">
              {login ? "Login" : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-gray-600 mt-5">
            {login ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setLogin(!login)} className="text-blue-700 font-semibold cursor-pointer ml-1 hover:underline">
              {login ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
