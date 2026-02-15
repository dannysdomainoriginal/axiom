import type { Task } from "@/services/task.service";
import { LuSquareArrowOutUpRight } from "react-icons/lu";

interface InfoBoxProps {
  label: string;
  value: string | number;
  youcandothis?: keyof Task | Task[keyof Task];
}

export const InfoBox = ({ label, value }: InfoBoxProps) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{value}</p>
    </>
  );
};

interface TodoChecklistProps {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}

export const TodoChecklist = ({
  text,
  isChecked,
  onChange,
}: TodoChecklistProps) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 rounded-sm outline-none cursor-pointer"
      />
      <label htmlFor="" className="text-[13px] text-gray-800">{text}</label>
    </div>
  );
};

interface AttachmentProps {
  link: string;
  index: number;
  onClick: () => void;
}

export const Attachment = ({ link, index, onClick }: AttachmentProps) => {
  return (
    <div className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer" onClick={onClick}>
      <div className="flex-1 flex items-center gap-3 border border-gray-100 min-w-0">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>

        <p className="text-xs text-black truncate">{link}</p>
      </div>

      <LuSquareArrowOutUpRight className="text-gray-400" />
    </div>
  )
};
