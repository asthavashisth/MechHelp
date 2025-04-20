import { useState } from "react";
import axios from "axios";

const MechanicRegister = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    specializations: "",
    serviceTypes: "",
    workingHoursStart: "",
    workingHoursEnd: "",
  });

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      specializations: "",
      serviceTypes: "",
      workingHoursStart: "",
      workingHoursEnd: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isRegister
        ? `${import.meta.env.VITE_USER_API_END_POINT}/mechanics/register`
        : `${import.meta.env.VITE_USER_API_END_POINT}/mechanics/login`;

      const payload = isRegister
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            address: formData.address,
            specializations: formData.specializations,
            serviceTypes: formData.serviceTypes,
            workingHours: {
              start: formData.workingHoursStart,
              end: formData.workingHoursEnd,
            },
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const response = await axios.post(url, payload);
      alert(response.data.message);
      console.log(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isRegister ? "Mechanic Registration" : "Mechanic Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="input-style"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-style"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="input-style"
                required
              />
              <input
                type="text"
                name="specializations"
                placeholder="Specializations"
                value={formData.specializations}
                onChange={handleChange}
                className="input-style"
                required
              />
              <input
                type="text"
                name="serviceTypes"
                placeholder="Service Types"
                value={formData.serviceTypes}
                onChange={handleChange}
                className="input-style"
                required
              />
              <div className="flex space-x-2">
                <input
                  type="time"
                  name="workingHoursStart"
                  value={formData.workingHoursStart}
                  onChange={handleChange}
                  className="input-style"
                  required
                />
                <input
                  type="time"
                  name="workingHoursEnd"
                  value={formData.workingHoursEnd}
                  onChange={handleChange}
                  className="input-style"
                  required
                />
              </div>
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-style"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-style"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline ml-1"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default MechanicRegister;
