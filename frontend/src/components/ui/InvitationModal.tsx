import React, { useState, type ChangeEvent, type FormEvent } from "react";
import Modal from "./Modal";
import { inviteService } from "@/services";
import { toast } from "@/libraries/sweetalert2";

type InvitationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const InvitationModal = (props: InvitationModalProps) => {
  const [chosen, setChosen] = useState<"admin" | "member">("member");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChosen(e.target.value as any);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, message } = await inviteService.getInviteCode({
        inviteAs: chosen,
      });
      toast.success(message!);
      setCode(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal {...props} title="Invite New Member">
      {!code ? (
        <div>
          <p className="text-sm mb-3">Invite member as:</p>
          <form onSubmit={onSubmit}>
            <div className="input-wrapper">
              <input
                type="checkbox"
                value="admin"
                id="admin"
                checked={chosen === "admin"}
                onChange={onChange}
              />
              <label className="cursor-pointer" htmlFor="admin">
                Admin
              </label>
            </div>
            <div className="input-wrapper">
              <input
                type="checkbox"
                value="member"
                id="member"
                checked={chosen === "member"}
                onChange={onChange}
              />
              <label className="cursor-pointer" htmlFor="member">
                Member
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-white whitespace-nowrap bg-primary hover:bg-primary/80 rounded-lg px-4 py-2 cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              >
                Get Invitation Code
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <p className="text-sm mb-3">Share this code to add a new member to your team:</p>
          <div className="w-full text-center pb-6">
            <p className="text-3xl tracking-wider font-thin font-mono">
              {code}
              </p>
              <p className="text-xs text-black/90 mt-1">Expires in 24 hours</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InvitationModal;
