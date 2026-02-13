import React from "react";

interface Props {
  avatars: string[];
  maxVisible: number;
}

const AvatarGroup = ({ avatars, maxVisible }: Props) => {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`Avatar ${idx}`}
          className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0"
        />
      ))}
      {avatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
