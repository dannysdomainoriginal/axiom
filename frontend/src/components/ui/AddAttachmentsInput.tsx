import type { TaskSchema } from "@/schemas";
import React, { useState } from "react";
import { useController, type Control } from "react-hook-form";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

type Props = {
  control: Control<TaskSchema>;
};

const AddAttachmentsInput = ({ control }: Props) => {
  const [option, setOption] = useState("");
  const {
    field: { value: attachments, onChange },
  } = useController({
    name: "attachments",
    control,
  });

  const setAttachments = (arg: typeof attachments) => onChange(arg);

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments!, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index: number) => {
    setAttachments(attachments?.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      {attachments?.map((item, idx) => (
        <div key={idx} className="flex justify-between bg-gray-50 border-gray-100 px-3 py-2 rounded-md mb-3 mt-2">
          <div className="flex-1 flex items-center gap-3 border border-gray-100">
            <LuPaperclip className="text-gray-400" />
            <p className="text-sm text-black">{item}</p>
          </div>

          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(idx)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip className="text-gray-400 cursor-pointer" title="Upload from Google Drive" />

          <input
            type="text"
            placeholder="Add File Input"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white py-2"
          />
        </div>

        <button
          className="card-btn text-nowrap"
          onClick={handleAddOption}
          disabled={!option.trim()}
        >
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
