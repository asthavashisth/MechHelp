import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-black w-full h-full p-3 mt-3">
      <div className="text-center">
        <h1 className="text-xl text-violet-700 font-bold font-poppins">
          Follow us on
        </h1>
      </div>
      <div className="flex gap-4 text-white p-3 items-center justify-center">
        {[
          { Icon: FaInstagram },
          { Icon: FaFacebook },
          { Icon: FaXTwitter },
          { Icon: FaGithub },
        ].map(({ Icon }, index) => (
          <div
            key={index}
            className="bg-violet-700 rounded-full p-2 w-10 h-10 flex items-center justify-center transition-transform transform hover:scale-125 hover:bg-gray-200 hover:text-black"
          >
            <Icon size={20} className="cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-20 mt-4">
        <div className="max-w-xl">
          <h1 className="text-violet-700 font-bold font-poppins text-xl mb-2">
            About Us
          </h1>
          <p className="text-violet-700 text-md font-poppins">
            MechHelp is an online mechanic service portal that helps users find
            nearby mechanics for immediate assistance.
          </p>
        </div>

        <div className="max-w-xl ml-10">
          <h1 className="text-violet-700 font-bold font-poppins text-xl mb-2 ml-3">
            Contact Us
          </h1>
          <div className="flex flex-col gap-1 text-violet-700 text-lg items-start">
            <div className="flex ml-3  items-center">
              <i className="fa-solid fa-phone"></i>
              <span>9130304068</span>
            </div>
            <div className="flex  items-center">
              <i className="fa-solid fa-envelope"></i>
              <span>mechhelp@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="flex mt-5 w-[300px] ml-auto mr-10">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow p-2 border border-violet-700 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-white text-center bg-transparent"
          />
          <button className="bg-violet-700 text-white font-semibold px-4 rounded-r-2xl hover:bg-gray-500 hover:text-black transition-all">
            Send
          </button>
        </div>
      </div>
      <div className="mt-5 p-2 text-center">
        <p className="text-violet-700 font-bold font-poppins">
          Copyright &copy; 2025 Designed by{" "}
          <span className="text-gray-400 uppercase">genz</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
