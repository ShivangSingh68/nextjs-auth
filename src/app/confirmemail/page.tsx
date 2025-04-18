"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function confirmEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const verifyEmail = async () => {
    try {
      const response = await axios.post("/api/users/confirmemail", { token });
      alert(response.data.message);
    } catch (error: any) {
      console.log(error.response.data.error);
      alert(error.response.data.error || "Unknown error");
    }
  };
  const loginNow = () => {
    router.push("/login");
  };

  useEffect(() => {
    const urlToken = window.location?.search?.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) verifyEmail();
  }, [token]);

  if (token.length === 0) {
    return (
      <div className="text-3xl text-blue-100 flex justify-center items-center min-h-screen">
        Check your email for Verification
      </div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <p className=" text-gray-50 text-4xl">
          You're Email is now Verified !!
        </p>
        <button
          className="rounded-lg shadow bg-blue-600 hover:bg-blue-700 p-2 mt-5 text-3xl"
          onClick={(e) => {
            e.preventDefault();
            loginNow();
          }}
        >
          Login Now
        </button>
      </div>
    );
  }
}
