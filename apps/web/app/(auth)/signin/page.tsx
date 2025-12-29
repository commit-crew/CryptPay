"use client";

import { numanFont } from "@/app/fonts";
import Signin from "@/components/Signin";
import * as motion from "motion/react-client";

const SigninPage = () => {
  return (
    <section className="flex w-screen h-screen">
      <Signin />
      <motion.div
        className={
          numanFont.className +
          " hidden md:flex flex-col items-center justify-center flex-1 bg-[#E5DBFF] text-[#6750A4]"
        }
      >
        <div>
          <motion.div className="text-[50px] lg:text-[70px]">Payments</motion.div>
          <motion.div className="text-[50px] lg:text-[70px]"
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
          <motion.div className="text-[50px] lg:text-[70px]"
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
