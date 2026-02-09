import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loadingState: {
    message: string;
    isLoading: boolean;
  };
  text: string;
}

const Button = ({ loadingState, text, ...props }: ButtonProps) => {
  return (
    <button {...props}>
      {loadingState.isLoading ? (
        <span className="flex items-center w-full justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingState.message}
        </span>
      ) : (
        `${text}`
      )}
    </button>
  );
};

export default Button;
