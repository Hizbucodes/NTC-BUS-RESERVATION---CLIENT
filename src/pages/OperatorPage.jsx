import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbReservedLine } from "react-icons/tb";
import { GrSchedules } from "react-icons/gr";
import { useSelector } from "react-redux";
import OperatorViewAllBooking from "../components/OperatorViewAllBooking";
import OperatorViewAllSchedules from "../components/OperatorViewAllSchedules";

const OperatorPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState("home");

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: <AiOutlineHome className="w-5 h-5" />,
    },
    {
      id: "viewAllBooking",
      label: "View All Booking",
      icon: <TbReservedLine className="w-5 h-5" />,
    },
    {
      id: "viewAllSchedules",
      label: "View All Schedules",
      icon: <GrSchedules className="w-5 h-5" />,
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeContent) {
      case "viewAllBooking":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
            <OperatorViewAllBooking />
          </div>
        );
      case "viewAllSchedules":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Trip Schedules</h2>
            <OperatorViewAllSchedules />
          </div>
        );

      case "home":
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to NTC Dashboard
            </h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p>Select an option from the sidebar to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed left-0 top-0 min-h-full w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 z-20
        `}
      >
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">NTC Dashboard</h1>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveContent(item.id)}
              className={`
                w-full flex items-center px-6 py-3 text-left
                hover:bg-gray-700 transition-colors duration-200
                ${activeContent === item.id ? "bg-gray-700" : ""}
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md lg:hidden hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
            <div className="ml-4 font-semibold">Welcome, {user?.firstName}</div>
          </div>
        </header>

        <main className="p-4">{renderContent()}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default OperatorPage;
