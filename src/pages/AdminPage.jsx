import React, { useState } from "react";
import { FaBars, FaBus, FaRoute, FaTimes } from "react-icons/fa";
import { MdCreateNewFolder } from "react-icons/md";
import { useSelector } from "react-redux";
import BusForm from "../components/BusForm";
import BusRouteForm from "../components/BusRouteForm";
import TripForm from "../components/TripForm";

const AdminPage = () => {
  const { user, loading } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState("createBusRoute");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      id: "createBusRoute",
      label: "Create Bus Route",
      icon: <FaRoute className="w-5 h-5" />,
    },
    {
      id: "createBus",
      label: "Create Bus",
      icon: <FaBus className="w-5 h-5" />,
    },

    {
      id: "createTrip",
      label: "Create Trip Schedule",
      icon: <MdCreateNewFolder className="w-5 h-5" />,
    },
  ];

  const renderContent = () => {
    switch (activeContent) {
      case "createBusRoute":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create Bus Route</h2>
            <BusRouteForm />
          </div>
        );
      case "createBus":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create Bus</h2>
            <BusForm />
          </div>
        );
      case "createTrip":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create Trip Schedule</h2>
            <TripForm />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminPage;
