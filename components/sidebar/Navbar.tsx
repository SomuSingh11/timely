import React from "react";
import { LogoutButton } from "../auth/LogoutButton";

function Navbar() {
  return (
    <div className="flex items-center justify-between">
      <span>Timely</span>
      <LogoutButton />
    </div>
  );
}

export default Navbar;
