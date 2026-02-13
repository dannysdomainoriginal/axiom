import type { TaskSchema } from "@/schemas";
import React, { useState } from "react";
import { useController, type Control } from "react-hook-form";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

type Props = {
  control: Control<TaskSchema>;
};

const TodoListInput = ({ control }: Props) => {
  const [option, setOption] = useState("");
  const {
    field: { value: todoList, onChange },
  } = useController({
    name: "todoChecklist",
    control,
  });

  const setTodoList = (arg: typeof todoList) => onChange(arg);

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList!, { text: option.trim(), completed: false }]);
      setOption("")
    }
  };

  const handleDeleteOption = (index: number) => {
    setTodoList(todoList?.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      {todoList?.map((item, idx) => (
        <div key={idx} className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-3 rounded-md mb-3 mt-2">
          <p className="text-sm text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">{idx < 9 ? `0${idx + 1}` : idx + 1}</span>
            {item.text}
          </p>

          <button className="cursor-pointer" onClick={() => handleDeleteOption(idx)}>
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap" onClick={handleAddOption} disabled={!option.trim()}>
          <HiMiniPlus className="text-lg" />Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
