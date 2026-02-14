import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl cursor-pointer" />
        ) : (
          <HiOutlineMenu className="text-2xl cursor-pointer" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">Axiom Dashboard</h2>

      <div
        className={`fixed top-15.25 -ml-4 bg-white ${!openSideMenu ? "-translate-x-105 ease-in" : "ease-out"} transition-transform duration-500 ease-in`}
      >
        <SideMenu />
      </div>
    </div>
  );
};

export default Navbar;
