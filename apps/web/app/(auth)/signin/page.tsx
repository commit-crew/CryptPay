"use client";

import { numanFont } from "@/app/fonts";
import Signin from "@/components/Signin";
import * as motion from "motion/react-client";

const SigninPage = () => {
  return (
    <section className="flex max-w-screen min-h-screen">
      <Signin />
      <motion.div
        className={
          numanFont.className +
          " hidden md:flex flex-col items-center justify-center flex-1 bg-[#E5DBFF] text-[#6750A4]"
        }
      >
        <div className="flex flex-col gap-3">
          <motion.div className="text-3xl lg:text-5xl">Payments</motion.div>
          <motion.div className="text-3xl lg:text-5xl"
          initial={{
            x: 30,
          }}
          animate={{
            y: 10
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          >Made</motion.div>
          <motion.div className="text-3xl lg:text-5xl"
          initial={{
            x: 55
          }}
           animate={{
            y: 10
          }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          >Easier</motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default SigninPage;
