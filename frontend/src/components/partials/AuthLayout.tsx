import React from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  side: "left" | "right";
};

const AuthLayout = ({ children, side }: Props) => {
  const isLeft = side === "left";

  const formInitialX = isLeft ? "-100%" : "100%";
  const imageInitialX = isLeft ? "100%" : "-100%";

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* FORM */}
      <motion.div
        key={`form-${side}`}
        initial={{ x: formInitialX }}
        animate={{ x: 0 }}
        transition={{
          duration: .8,
          ease: "easeInOut",
        }}
        className={`w-screen md:w-[60vw] px-12 pt-8 pb-20 ${
          isLeft ? "order-1" : "order-2"
        }`}
      >
        <h2 className="text-lg font-medium text-black">Axiom Task Manager For Teams</h2>
        {children}
      </motion.div>

      {/* IMAGE */}
      <motion.div
        key={`image-${side}`}
        initial={{ x: imageInitialX }}
        animate={{ x: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className={`hidden md:flex w-[40vw] items-center justify-center bg-blue-50 bg-[url('/bg-img.png')] bg-cover bg-no-repeat bg-center ${
          isLeft ? "order-2" : "order-1"
        }`}
      >
        <img
          src="/images/auth-bg.png"
          alt="AUTH IMAGE"
          className="object-cover h-full"
        />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
