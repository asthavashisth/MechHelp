import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [userType, setUserType] = useState("user"); // "user" or "mechanic"
  const [isLogin, setIsLogin] = useState(false); // Login mode toggle
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    location: "",
    specializations: "",
    serviceTypes: "",
    availability: "",
    workingHours: "",
    isAvailable: true,
    verified: false,
    rating: 0,
    totalCompletedServices: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = `${import.meta.env.VITE_USER_API_END_POINT}/${userType}`; // Use the environment variable for API base URL

    try {
      let response;
      if (isLogin) {
        response = await axios.post(`${apiUrl}/login`, {
          email: formData.email,
          password: formData.password,
        });
        alert("Login Successful");
      } else {
        response = await axios.post(`${apiUrl}/register`, formData);
        alert("Registration Successful");
      }
      console.log(response); // Log the response from API for debugging
    } catch (error) {
      console.error("Error in request", error);
      alert(isLogin ? "Login Failed" : "Registration Failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-8 rounded-lg shadow-lg text-white">
      <h2 className="text-3xl font-semibold text-center mb-6">
        {isLogin ? "Login" : userType === "mechanic" ? "Mechanic" : "User"}{" "}
        {isLogin ? "" : "Sign Up"}
      </h2>

      {/* Toggle between Login and SignUp */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className={`${
            isLogin ? "bg-blue-500" : "bg-gray-200 text-black"
          } text-white py-2 px-6 rounded-l-lg`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className={`${
            !isLogin ? "bg-blue-500" : "bg-gray-200 text-black"
          } text-white py-2 px-6 rounded-r-lg`}
        >
          Sign Up
        </button>
      </div>

      {/* Dropdown for user type (remains visible in both Login and Sign Up) */}
      <div className="flex justify-center mb-6">
        <select
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
          className="bg-gray-200 text-black py-2 px-6 rounded-md"
        >
          <option value="user">User</option>
          <option value="mechanic">Mechanic</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {!isLogin && userType === "user" && (
            <>
              <div className="flex flex-col">
                <label className="text-gray-100">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          {!isLogin && userType === "mechanic" && (
            <>
              <div className="flex flex-col">
                <label className="text-gray-100">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Location (Coordinates)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                  placeholder="e.g. (latitude, longitude)"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Specializations</label>
                <input
                  type="text"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                  placeholder="e.g. Engine Repair, Transmission"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Service Types</label>
                <input
                  type="text"
                  name="serviceTypes"
                  value={formData.serviceTypes}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                  placeholder="e.g. Car Wash, Oil Change"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Availability</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                  placeholder="e.g. Available, Not Available"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-100">Working Hours</label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  required
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                  placeholder="e.g. 9 AM - 6 PM"
                />
              </div>
            </>
          )}

          {/* Common fields for both User and Mechanic */}
          <div className="flex flex-col">
            <label className="text-gray-100">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-100">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-2 p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
