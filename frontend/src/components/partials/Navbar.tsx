import React, { useState } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Button from "../ui/Button";
import { useAuth } from "@/hooks/api/useAuth";
import InvitationModal from "../ui/InvitationModal";
import { LuUserPlus } from "react-icons/lu";

const Navbar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);

  const { isAdmin } = useAuth();

  return (
    <>
      <div className="flex gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30 items-center">
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

        {/* INVITE BUTTONS */}
        {isAdmin && (
          <>
            <button
              onClick={() => setOpenInviteModal(true)}
              className="ms-auto max-[520px]:hidden bg-primary px-4 py-2 hover:bg-primary/80 cursor-pointer text-white rounded-md"
            >
              Invite Member
            </button>
            <button
              onClick={() => setOpenInviteModal(true)}
              className="ms-auto min-[520px]:hidden bg-primary px-3 py-2 hover:bg-primary/80 cursor-pointer text-white rounded-md aspect-square"
            >
              <LuUserPlus className="size-4" />
            </button>
          </>
        )}

        <div
          className={`fixed top-15.25 -ml-4 bg-white ${!openSideMenu ? "-translate-x-105 ease-in" : "ease-out"} transition-transform duration-500 ease-in`}
        >
          <SideMenu />
        </div>
      </div>

      {/* INVITATION MODAL */}
      {openInviteModal && (
        <InvitationModal
          isOpen={openInviteModal}
          onClose={() => setOpenInviteModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
