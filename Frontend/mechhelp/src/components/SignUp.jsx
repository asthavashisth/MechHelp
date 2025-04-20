import { useState } from "react";
import UserAuth from "./UserAuth";
import MechanicAuth from "./MechanicAuth";

const SignUp = () => {
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Choose Your Role
        </h1>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="user">User</option>
          <option value="mechanic">Mechanic</option>
        </select>
        {role === "user" ? <UserAuth /> : <MechanicAuth />}
      </div>
    </div>
  );
};

export default SignUp;
