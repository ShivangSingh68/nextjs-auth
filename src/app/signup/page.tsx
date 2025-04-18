"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function signupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/signup", user);
      console.log(response.data.message);
      alert(response?.data?.message);
      router.push("/confirmemail");
    } catch (error: any) {
      console.log(error.response?.data?.error);

      alert(error.response?.data?.error || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-900 ">
      <h1 className="text-4xl py-4">SignUp</h1>
      <form className="flex flex-col bg-gray-800 p-4 rounded-lg w-96">
        <label htmlFor="Email" className="text-lg py-2">
          Email
        </label>
        <input
          type="text"
          placeholder="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg"
        />
        <label htmlFor="Username" className="text-lg py-2">
          Username
        </label>
        <input
          type="text"
          placeholder="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg"
        />
        <label htmlFor="Password" className="text-lg py-2">
          Password
        </label>
        <input
          type="password"
          placeholder="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="p-2 focus:outline-gray-200 focus:outline-1 rounded-md mb-3.5 shadow-lg"
        />
        <button
          type="submit"
          className="bg-blue-700 w-full mt-4 py-3.5 text-1xl text-gray-300 rounded-lg shadow-lg hover:bg-blue-800"
          onClick={(e) => {
            e.preventDefault();
            onSignUp();
          }}
        >
          {loading ? "processing" : "Sign Up"}
        </button>
        <Link
          href="/login"
          className="w-full justify-center items-center mt-3.5 text-blue-300 text-center hover:text-blue-500"
        >
          Already have an Account?
        </Link>
      </form>
    </div>
  );
}
