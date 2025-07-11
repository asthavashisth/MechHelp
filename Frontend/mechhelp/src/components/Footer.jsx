import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-[#0A0E31] w-full p-6 flex flex-col justify-between min-h-[300px] mt-10">
      <div>
        <div className="text-center mb-8">
          <h1 className="text-3xl text-cyan-400 font-bold font-poppins">
            Connect with Us
          </h1>
        </div>

        <div className="flex gap-6 text-white mb-12 justify-center">
          {[
            { Icon: FaInstagram },
            { Icon: FaFacebook },
            { Icon: FaXTwitter },
            { Icon: FaGithub },
          ].map(({ Icon }, index) => (
            <div
              key={index}
              className="bg-cyan-400 rounded-full p-3 w-12 h-12 flex items-center justify-center transition-all transform hover:scale-125 hover:bg-white hover:text-cyan-500 shadow-md"
            >
              <Icon size={24} className="cursor-pointer" />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:justify-around items-center gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-cyan-400 font-bold font-poppins text-2xl mb-3">
              About Us
            </h2>
            <p className="text-gray-300 font-poppins max-w-xs leading-relaxed">
              MechHelp provides instant access to skilled mechanics whenever your vehicle needs help. Fast, Reliable, and Nearby!
            </p>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-cyan-400 font-bold font-poppins text-2xl mb-3">
              Contact Us
            </h2>
            <div className="flex flex-col text-gray-300 gap-3 font-poppins">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <i className="fa-solid fa-phone"></i>
                <span>+91 9828919203</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <i className="fa-solid fa-envelope"></i>
                <span>mechhelp@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="flex mt-3 w-[300px]">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow p-2 border border-cyan-400 rounded-l-2xl bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button className="bg-cyan-400 px-4 rounded-r-2xl text-black font-semibold hover:bg-white hover:text-cyan-600 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center border-t border-gray-700 pt-4">
        <p className="text-gray-400 font-poppins text-sm">
          &copy; 2025 MechHelp | Designed by{" "}
          <span className="uppercase text-cyan-400">@astha vashisth</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
