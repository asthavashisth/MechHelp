// import { useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// const MechanicRegister = () => {
//   const [isRegister, setIsRegister] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     address: "",
//     specializations: "",
//     serviceTypes: "",
//     workingHoursStart: "",
//     workingHoursEnd: "",
//   });

//   const toggleMode = () => {
//     setIsRegister((prev) => !prev);
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       password: "",
//       address: "",
//       specializations: "",
//       serviceTypes: "",
//       workingHoursStart: "",
//       workingHoursEnd: "",
//     });
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const url = isRegister
//         ? `${import.meta.env.VITE_MECHANIC_API_END_POINT}/register`
//         : `${import.meta.env.VITE_MECHANIC_API_END_POINT}/login`;

//       const payload = isRegister
//         ? {
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           password: formData.password,
//           address: formData.address,
//           specializations: formData.specializations,
//           serviceTypes: formData.serviceTypes,
//           workingHours: {
//             start: formData.workingHoursStart,
//             end: formData.workingHoursEnd,
//           },
//         }
//         : {
//           email: formData.email,
//           password: formData.password,
//         };

//       const response = await axios.post(url, payload, { withCredentials: true });

//       if (isRegister) {
//         toast.success("Registration successful! You can now log in.");
//         toggleMode(); // Optional: Automatically switch to login after registration
//       } else {
//         toast.success("Login successful! Welcome back.");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";

//       if (isRegister) {
//         if (errorMessage.includes("email already exists") || errorMessage.includes("Phone already exists")) {
//           toast.error("Email or phone number already registered. Try logging in.");
//         } else {
//           toast.error(errorMessage);
//         }
//       } else {
//         if (errorMessage.includes("Invalid credentials")) {
//           toast.error("Incorrect email or password. Please try again.");
//         } else {
//           toast.error(errorMessage);
//         }
//       }
//     }
//   };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
//       <Toaster position="top-right" />

//       <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           {isRegister ? "Mechanic Registration" : "Mechanic Login"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {isRegister && (
//             <>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="input-style"
//                 required
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className="input-style"
//                 required
//               />
//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className="input-style"
//                 required
//               />
//               <input
//                 type="text"
//                 name="specializations"
//                 placeholder="Specializations"
//                 value={formData.specializations}
//                 onChange={handleChange}
//                 className="input-style"
//                 required
//               />
//               <input
//                 type="text"
//                 name="serviceTypes"
//                 placeholder="Service Types"
//                 value={formData.serviceTypes}
//                 onChange={handleChange}
//                 className="input-style"
//                 required
//               />
//               <div className="flex space-x-2">
//                 <input
//                   type="time"
//                   name="workingHoursStart"
//                   value={formData.workingHoursStart}
//                   onChange={handleChange}
//                   className="input-style"
//                   required
//                 />
//                 <input
//                   type="time"
//                   name="workingHoursEnd"
//                   value={formData.workingHoursEnd}
//                   onChange={handleChange}
//                   className="input-style"
//                   required
//                 />
//               </div>
//             </>
//           )}
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="input-style"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="input-style"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
//           >
//             {isRegister ? "Register" : "Login"}
//           </button>
//         </form>
//         <p className="text-center text-sm mt-4 text-gray-600">
//           {isRegister ? "Already have an account?" : "Don't have an account?"}
//           <button
//             onClick={toggleMode}
//             className="text-blue-600 hover:underline ml-1"
//           >
//             {isRegister ? "Login" : "Register"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MechanicRegister;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

// Convert 24-hour time to 12-hour format
const convertTo12HourFormat = (time) => {
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);
  const period = hours >= 12 ? "PM" : "AM";

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes} ${period}`;
};

const MechanicAuth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_MECHANIC_API_END_POINT}/${isRegister ? "register" : "login"
        }`;

      const workingHoursStart12Hr = convertTo12HourFormat(formData.workingHoursStart);
      const workingHoursEnd12Hr = convertTo12HourFormat(formData.workingHoursEnd);

      const payload = isRegister
        ? {
          ...formData,
          workingHours: {
            start: workingHoursStart12Hr,
            end: workingHoursEnd12Hr,
          },
          isAvailable: true,
          verified: false,
          rating: 0,
          totalCompletedServices: 0,
        }
        : {
          email: formData.email,
          password: formData.password,
        };

      // Clean up unnecessary keys
      delete payload.workingHoursStart;
      delete payload.workingHoursEnd;

      const res = await axios.post(url, payload, { withCredentials: true });
      toast.success(`${isRegister ? "Registration" : "Login"} successful!`);

      if (!isRegister) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("mechanicInfo", JSON.stringify(res.data.mechanic));
        localStorage.setItem(
          "workingHours",
          JSON.stringify({
            start: workingHoursStart12Hr,
            end: workingHoursEnd12Hr,
          })
        );
        Cookies.set("mechanicId", res.data.mechanic._id, { expires: 7 });
        setIsLoggedIn(true);
        navigate("/mechdashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

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

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold text-center text-gray-700">
        {isRegister ? "Mechanic Registration" : "Mechanic Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="specializations" className="block text-sm font-medium text-gray-600">
                Specializations (e.g., engine, brakes)
              </label>
              <input
                name="specializations"
                type="text"
                placeholder="Specializations"
                value={formData.specializations}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label htmlFor="serviceTypes" className="block text-sm font-medium text-gray-600">
                Service Types (e.g., on-site, in-garage)
              </label>
              <input
                name="serviceTypes"
                type="text"
                placeholder="Service Types"
                value={formData.serviceTypes}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Working Hours</label>
              <div className="flex space-x-4">
                <div className="w-full">
                  <label htmlFor="workingHoursStart" className="block text-sm font-medium text-gray-600">
                    Start Time
                  </label>
                  <input
                    name="workingHoursStart"
                    type="time"
                    value={formData.workingHoursStart}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="workingHoursEnd" className="block text-sm font-medium text-gray-600">
                    End Time
                  </label>
                  <input
                    name="workingHoursEnd"
                    type="time"
                    value={formData.workingHoursEnd}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Common Email & Password Fields */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <p
        onClick={toggleMode}
        className="text-sm text-center text-blue-600 cursor-pointer"
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default MechanicAuth;

