"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { mailSender } from "@/helpers/mailer";
import User from "@/models/users.models";
import { useRouter } from "next/navigation";

export default function forgotPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  const onButtonClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", { email });
      setLoading(false);
      setText("Check your email!!");
      alert(response.data.message);
    } catch (error: any) {
      alert(error.response.data.error || "Unknown error");
    }
  };

  const changePassword = async () => {
    try {
      if (newPassword === confirmPassword) {
        const response = await axios.post("/api/users/resetpassword", {
          token,
          newPassword,
        });
        alert(response.data.message);
      } else {
        alert("Both passwords must be same");
      }
      router.push("/login");
    } catch (error: any) {
      alert(error.response.data.error || "Unknown Error");
    }
  };

  useEffect(() => {
    const otp = window?.location?.search?.split("=")[1];
    setToken(otp);
  }, []);

  if (token?.length > 0) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-900 ">
        <h1 className="text-4xl py-4">Forgot Password</h1>
        <form className="flex flex-col bg-gray-800 p-4 rounded-lg w-96">
          <label htmlFor="new password" className="text-lg py-2">
            New Password
          </label>
          <input
            type="password"
            name=""
            id=""
            placeholder="new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg"
          />
          <label htmlFor="Password" className="text-lg py-2">
            Confirm Password
          </label>
          <input
            type="password"
            name=""
            id=""
            placeholder=" confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg"
          />
          <button
            type="submit"
            className="bg-blue-700 w-full mt-4 py-3.5 text-lg text-gray-300 rounded-lg shadow-lg hover:bg-blue-800"
            onClick={(e) => {
              e.preventDefault();
              changePassword();
            }}
          >
            {loading ? " processing" : "Change password"}
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-900 ">
        <h1 className="text-4xl py-4">Forgot Password</h1>
        <form className="flex flex-col bg-gray-800 p-4 rounded-lg w-96 h-64">
          <label htmlFor="new password" className="text-lg py-2">
            Email
          </label>
          <input
            type="email"
            name=""
            id=""
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg mt-5"
          />

          <button
            type="submit"
            className="bg-blue-700 w-full mt-4 py-3.5 text-lg text-gray-300 rounded-lg shadow-lg hover:bg-blue-800"
            onClick={(e) => {
              e.preventDefault();
              onButtonClick();
            }}
          >
            {loading ? " processing" : "Send mail"}
          </button>
          <div className="text-2xl w-full text-center mt-2 ">{text}</div>
        </form>
      </div>
    );
  }
}
