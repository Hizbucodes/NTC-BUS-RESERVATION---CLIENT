import React, { useState } from "react";
import { FaBars, FaBus, FaRoute, FaTimes, FaTrash } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdCreateNewFolder } from "react-icons/md";
import { TbReservedLine } from "react-icons/tb";
import { useSelector } from "react-redux";
import BusForm from "../components/BusForm";
import BusFormUpdate from "../components/BusFormUpdate";
import BusRouteForm from "../components/BusRouteForm";
import BusRouteFormUpdate from "../components/BusRouteFormUpdate";
import CancelTripSchedule from "../components/CancelTripSchedule";
import TripForm from "../components/TripForm";
import TripFormUpdate from "../components/TripFormUpdate";
import ViewAllBooking from "../components/ViewAllBooking";

const AdminPage = () => {
  const { user, loading } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState("createBusRoute");

  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (itemId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const navItems = [
    {
      id: "Manage Bus Route",
      label: "Manage Bus Route",
      icon: <FaRoute className="w-5 h-5" />,
      children: [
        {
          id: "Create Bus Route",
          label: "Create Bus Route",
          icon: <IoAddCircleSharp className="w-4 h-4" />,
        },
        {
          id: "Update Bus Route",
          label: "Update Bus Route",
          icon: <GrUpdate className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "Manage Bus",
      label: "Manage Bus",
      icon: <FaBus className="w-5 h-5" />,
      children: [
        {
          id: "Create Bus",
          label: "Create Bus",
          icon: <IoAddCircleSharp className="w-4 h-4" />,
        },
        {
          id: "Update Bus",
          label: "Update Bus",
          icon: <GrUpdate className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "Manage Trip Schedule",
      label: "Manage Trip Schedule",
      icon: <MdCreateNewFolder className="w-5 h-5" />,
      children: [
        {
          id: "Create Trip Schedule",
          label: "Create Trip Schedule",
          icon: <IoAddCircleSharp className="w-4 h-4" />,
        },
        {
          id: "Update Trip Schedule",
          label: "Update Trip Schedule",
          icon: <GrUpdate className="w-4 h-4" />,
        },
        {
          id: "Cancel Trip Schedule",
          label: "Cancel Trip Schedule",
          icon: <FaTrash className="w-4 h-4" />,
        },
      ],
    },
    {
      id: "viewAllBooking",
      label: "View All Booking",
      icon: <TbReservedLine className="w-5 h-5" />,
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeContent) {
      case "Create Bus Route":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create Bus Route</h2>
            <BusRouteForm />
          </div>
        );
      case "Update Bus Route":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Update Bus Route</h2>

            <BusRouteFormUpdate />
          </div>
        );

      case "Create Bus":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create Bus</h2>
            <BusForm />
          </div>
        );
      case "Update Bus":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Update Bus</h2>
            <BusFormUpdate />
          </div>
        );

      case "Create Trip Schedule":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create Trip Schedule</h2>
            <TripForm />
          </div>
        );
      case "Update Trip Schedule":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Update Trip Schedule</h2>
            <TripFormUpdate />
          </div>
        );
      case "Cancel Trip Schedule":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Cancel Trip Schedule</h2>
            <CancelTripSchedule />
          </div>
        );

      case "viewAllBooking":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
            <ViewAllBooking />
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to NTC Admin Dashboard
            </h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p>Select an option from the sidebar to get started</p>
            </div>
          </div>
        );
    }
  };

  const NavItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openDropdowns[item.id];

    return (
      <div className="w-full">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleDropdown(item.id);
            } else {
              setActiveContent(item.id);
            }
          }}
          className={`
            w-full flex items-center justify-between px-6 py-3 text-left
            hover:bg-gray-700 transition-colors duration-200
            ${activeContent === item.id ? "bg-gray-700" : ""}
          `}
        >
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </div>
          {hasChildren && (
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>

        {hasChildren && isOpen && (
          <div className="bg-gray-900 overflow-hidden transition-all duration-200">
            {item.children.map((child) => (
              <button
                key={child.id}
                onClick={() => setActiveContent(child.id)}
                className={`
                  w-full flex items-center px-8 py-2 text-left text-sm
                  hover:bg-gray-700 transition-colors duration-200
                  ${activeContent === child.id ? "bg-gray-700" : ""}
                `}
              >
                <span className="mr-3">{child.icon}</span>
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
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
            <NavItem key={item.id} item={item} />
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
