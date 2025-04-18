"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { text } from "stream/consumers";

export default function userProfile({ params }: any) {
  const router = useRouter();
  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      alert(error.response.data.error || "Unknown error");
    }
  };

  return (
    <div className="flex flex-col min-w-screen min-h-screen justify-center items-center">
      <div className="text-4xl mb-3">Profile page{params.id}</div>
      <button
        className="text-2xl mt-3 bg-amber-700 rounded-lg p-2 hover:bg-amber-800"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
