import React from "react";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="bg-amber-200 h-screen">
      <Outlet />
    </div>
  );
};

export default Layout;
