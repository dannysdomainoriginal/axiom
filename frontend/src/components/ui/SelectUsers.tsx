import { toast } from "@/libraries/sweetalert2";
import type { TaskSchema } from "@/schemas";
import { userService } from "@/services";
import type { User } from "@/services/user.service";
import React, { useEffect, useState } from "react";
import { useController, type Control } from "react-hook-form";
import { LuUsers } from "react-icons/lu";
import Modal from "./Modal";
import AvatarGroup from "./AvatarGroup";

type Props = {
  control: Control<TaskSchema>;
};

const SelectUsers = ({ control }: Props) => {
  const [allUsers, setAllUsers] = useState<
    Pick<User, "_id" | "name" | "email" | "profileImageUrl">[]
  >([]);

  const {
    field: { value: selectedUsers, onChange: setSelectedUsers },
  } = useController({
    name: "assignedTo",
    control,
  });
  
  const [tempSelectedUsers, setTempSelectedUsers] = useState<User["_id"][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllUsers = async () => {
    try {
      const { data } = await userService.fetchUsersProfileImages();
      setAllUsers(data);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (tempSelectedUsers.length === 0) {
      setTempSelectedUsers(selectedUsers); // sync them on load
    }
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 ? (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      ) : (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              className="flex items-center gap-4 p-3 border-b border-gray-200"
              key={user._id}
            >
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </p>
                <p className="text-[13px] text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
