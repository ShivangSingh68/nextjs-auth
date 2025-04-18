"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function loginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      router.push(`/profile/${response.data.user._id}`);
    } catch (error: any) {
      console.log(error?.response?.data?.error);
      alert(error?.response?.data?.error || "Unknown Error");
    } finally {
      setLoading(false);
    }
  };
  const handleSignUpbutton = () => {
    router.push("/signup");
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-900 ">
      <h1 className="text-4xl py-4">Login</h1>
      <form className="flex flex-col bg-gray-800 p-4 rounded-lg w-96">
        <label htmlFor="Email" className="text-lg py-2">
          Email
        </label>
        <input
          type="text"
          name=""
          id=""
          placeholder="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg"
        />
        <label htmlFor="Password" className="text-lg py-2">
          Password
        </label>
        <input
          type="password"
          name=""
          id=""
          placeholder="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg"
        />
        <button
          type="submit"
          className="bg-blue-700 w-full mt-4 py-3.5 text-lg text-gray-300 rounded-lg shadow-lg hover:bg-blue-800"
          onClick={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          {loading ? " processing" : "Login"}
        </button>

        <Link
          href="/forgotpassword"
          className="w-full justify-center items-center mt-3.5 text-blue-300 text-center mb-4 hover:text-blue-500"
        >
          Forgotten password?
        </Link>
        <hr />
        <button
          className="bg-green-600 w-full py-3.5 text-lg text-gray-300 rounded-lg shadow-lg  mt-4 hover:bg-green-700 "
          onClick={(e) => {
            e.preventDefault();
            handleSignUpbutton();
          }}
        >
          Create new account
        </button>
      </form>
    </div>
  );
}
