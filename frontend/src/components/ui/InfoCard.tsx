import React from "react";
import type { IconType } from "react-icons/lib";

interface InfoCardProps {
  label: string;
  value: string;
  color: string;
}

const InfoCard = ({ label, value, color }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 ${color} rounded`} />
      
      <p className="text-xs md:text=[14px] text-gray-500">
        <span className="text-sm md:text-[15px] text-black font-semibold">{value}</span> {label}
      </p>
    </div>
  );
};

export default InfoCard;
