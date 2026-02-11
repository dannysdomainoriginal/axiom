import React from "react";

type Props = {
  children: React.ReactNode;
  side: "left" | "right"
};

const AuthLayout = ({ children, side }: Props) => {
  return (
    <div className="flex">
      {side === "left" && (
        <div className="w-screen min-h-screen md:w-[60vw] px-12 pt-8 pb-20">
          <h2 className="text-lg font-medium text-black">Task Manager</h2>
          {children}
        </div>
      )}

      <div className="hidden md:flex w-[40vw] min-h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <img src="/ui-img.png" alt="AUTH IMAGE" className="w-64 lg:w-[90%]" />
      </div>

      {side === "right" && (
        <div className="w-screen min-h-screen md:w-[60vw] px-12 pt-8 pb-20">
          <h2 className="text-lg font-medium text-black">Task Manager</h2>
          {children}
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
