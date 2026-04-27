import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardHome from "../components/DashboardHome";
import AdminUsers from "../pages/AdminUsers";
import AdminDashboard from "./AdminDashboard";
import AdminReviews from "./AdminReviews";
import RiderManagement from "./AdminRider";


export default function MainDashboard({ token, admin }) {
  const [active, setActive] = useState("dashboard");

  let content;
  switch (active) {
    case "dashboard":
      content = <DashboardHome />;
      break;
    case "users":
      content = <AdminUsers token={token} />;
      break;
    case "restaurants":
      content = <AdminDashboard token={token} />;
      break;
    case "delivery":
      content = <RiderManagement token={token} />;
      break;
    case "reviews":
      content = <AdminReviews token={token} />;
      break;
    default:
      content = <DashboardHome />;
  }

  return (
    <div className="flex">
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar admin={admin} />
        <main className="flex-1 p-8 bg-gray-100">{content}</main>
      </div>
    </div>
  );
}
