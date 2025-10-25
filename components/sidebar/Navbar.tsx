"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Zap } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center px-16">
      <div className="flex items-center gap-1">
        <Zap size={24} className="text-blue-500" />
        <h1 className="text-xl font-semibold">Timely</h1>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {user.name || user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1 px-2 hover:cursor-pointer py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
