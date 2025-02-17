import React, { useState } from "react";
import { info } from "../assets/info";

const SignUp = () => {
  const [login, setLogin] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center max-w-4xl w-full">
        
        {/* Left Side - Image */}
        <div className="hidden sm:block">
          <img src={info[0].image} alt={info[0].name} className="w-[400px] rounded-lg" />
        </div>

        {/* Right Side - Form */}
        <div className="w-full sm:w-1/2 p-5">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
            {login ? "Login" : "Sign Up"}
          </h1>

          <form className="space-y-4">
            {!login && (
              <>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Name</label>
                  <input type="text" className="w-full border border-gray-300 p-2 rounded-lg" required />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Phone No</label>
                  <input type="number" className="w-full border border-gray-300 p-2 rounded-lg" required />
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Email</label>
              <input type="email" className="w-full border border-gray-300 p-2 rounded-lg" required />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Password</label>
              <input type="password" className="w-full border border-gray-300 p-2 rounded-lg" required />
            </div>

            <button className="w-full bg-blue-700 text-white font-semibold py-2 rounded-full transition duration-300 hover:bg-amber-300 hover:text-black">
              {login ? "Login" : "Sign Up"}
            </button>
          </form>

          
          <p className="text-center text-gray-600 mt-4">
            {login ? "Don't have an account?" : "Already have an account?"}  
            <span 
              onClick={() => setLogin(!login)} 
              className="text-blue-600 font-semibold cursor-pointer hover:underline ml-1"
            >
              {login ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

