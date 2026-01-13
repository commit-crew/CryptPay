"use client";

import { numanFont } from "@/app/fonts";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/lib/user";
import type { CurrentUser } from "@/lib/types";
import TransactionHist from "@/components/TransactionHist";
import QR from "@/components/QRRecieve";
import Search from "@/components/Search";

const CryptoPay = () => {
  const router = useRouter();
  const [searchOpen, setSearhOpen] = useState(false);
  const [QROpen, setQROpen] = useState(false);
  const [recieveOpen, setRecieveOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          router.push("/signin");
          return;
        }

        const response = await verifyToken(token);
        setCurrentUser(response.data ?? null);
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("authToken");
        router.push("/signin");
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/signin");
  };

  // Show loading while checking authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6750A4]"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <section className="max-w-[1600px] min-h-screen flex flex-col items-center justify-between">
      {!searchOpen && !QROpen && !recieveOpen ? (
        <>
          <div className="flex justify-between items-center p-8 w-full">
            <div
              className={
                numanFont.className + " text-[#6750A4] text-xl xl:text-2xl"
              }
            >
              CryptoPay
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-gray-600">
                Welcome, {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
              <Image
                src={"/images/profile-icon.jpg"}
                alt=""
                width={30}
                height={30}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-26 w-full items-center max-w-[330px] md:max-w-[700px]">
            <div className="relative flex flex-col items-center gap-15 w-full">
              <div className="w-full" onClick={() => setSearhOpen(true)}>
                <div className="absolute left-5 z-20 top-6 transform -translate-y-1/2">
                  <Image
                    src={"/images/search-icon.svg"}
                    alt=""
                    width={25}
                    height={25}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name..."
                  className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus-visible:right-0 focus:border-transparent drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] bg-[#F6F6F6]"
                />
              </div>
              <div className="flex gap-10">
                <div
                  className="flex md:hidden flex-col items-center gap-2"
                  onClick={() => setQROpen(true)}
                >
                  <div className="p-4 bg-[#CEBBFF] rounded-xl w-fit">
                    <Image
                      src={"/images/QR-icon.svg"}
                      alt=""
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <div>Scan</div>
                    <div>QR code</div>
                  </div>
                  {/* <QR publicAddress={currentUser.publicAddress}/> */}
                </div>
                <div
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => setSearhOpen(true)}
                >
                  <div className="p-4 bg-[#CEBBFF] rounded-xl w-fit">
                    <Image
                      src={"/images/tokens-icon.svg"}
                      alt=""
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <div>Pay</div>
                    <div> Anyone</div>
                  </div>
                </div>
                <div
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => setRecieveOpen(true)}
                >
                  <div className="p-4 bg-[#CEBBFF] rounded-xl w-fit">
                    <Image
                      src={"/images/recieve-icon.svg"}
                      alt=""
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>Recieve</div>
                </div>
              </div>
            </div>
            <TransactionHist userId={currentUser.id} limit={2} />
          </div>
        </>
      ) : searchOpen ? (
        <Search setSearchOpen={setSearhOpen}/>
      ) : QROpen ? (
        <></>
      ) : (
        <></>
      )}
    </section>
  );
};

export default CryptoPay;
