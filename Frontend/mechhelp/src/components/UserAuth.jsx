import { useState } from "react";
import axios from "axios";

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_USER_API_END_POINT}/users/${
        isLogin ? "login" : "register"
      }`;
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(url, payload);
      alert(`${isLogin ? "Login" : "Registration"} successful!`);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-700">
        {isLogin ? "User Login" : "User Registration"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </>
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-center text-blue-600 cursor-pointer"
      >
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default UserAuth;
