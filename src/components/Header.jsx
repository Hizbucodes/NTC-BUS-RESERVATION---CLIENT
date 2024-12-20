import { CiCircleRemove, CiMenuBurger } from "react-icons/ci";
import ntc_logo_banner from "../assets/NTC_LOGO.jpg";
import NavBar from "./NavBar";
import { Fragment, useState } from "react";
import MobileNavBar from "./MobileNavBar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/feature/auth/authSlice";
import { IoLogOutOutline } from "react-icons/io5";

const Header = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleMenuBar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Fragment>
      <div className="relative flex justify-between items-center w-full h-20 lg:px-12 px-2 z-10 shadow-sm">
        <Link to={"/"}>
          <img
            className="object-cover w-[9rem] rounded-md"
            src={ntc_logo_banner}
            alt="logo"
            title="NATIONAL TRANSPORT COMMISSION"
          />
        </Link>

        <NavBar />

        <div className="hidden sm:flex gap-x-5 font-semibold items-center">
          {token && user ? (
            <>
              <p className="font-normal">
                Welcome, <span className="font-medium">{user?.firstName}!</span>
              </p>
              <button
                onClick={handleLogout}
                className="bg-black text-white rounded-md w-[7rem] px-2 py-2 pr-3 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity flex justify-between items-center group"
              >
                <span>Logout</span>
                <IoLogOutOutline className="group-hover:translate-x-2 duration-200 ease-linear text-xl group-hover:animate-pulse" />
              </button>
            </>
          ) : (
            <>
              <Link to={"/login"}>
                <button
                  type="button"
                  className="px-8 py-2 border-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity rounded-md"
                >
                  Log in
                </button>
              </Link>
              <Link to={"/register"}>
                <button
                  type="button"
                  className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity"
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={toggleMenuBar}
          className=" mr-12 sm:hidden"
        >
          {isOpen ? <CiMenuBurger size={30} /> : <CiCircleRemove size={30} />}
        </button>
      </div>

      {/* Mobile Responsive NavBar */}
      <div
        className={`
          sm:hidden 
          fixed 
          top-20 
          right-0 
          w-1/2 
          bg-zinc-100
          rounded-l-md
          transform 
          transition-transform 
          duration-300 
          ease-in-out 
          ${!isOpen ? "translate-x-0" : "translate-x-full"}
          flex 
          flex-col 
          items-center 
          justify-evenly 
          h-[calc(100vh-5rem)]
          z-40
        `}
      >
        <MobileNavBar />

        <div className="flex flex-col gap-y-5 font-semibold">
          {token && user ? (
            <>
              <p className="font-normal">
                Welcome, <span className="font-medium">{user?.firstName}!</span>
              </p>
              <button
                onClick={handleLogout}
                className="bg-black text-white rounded-md w-[7rem] px-2 py-2 pr-3 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity flex justify-between items-center group mx-auto"
              >
                <span>Logout</span>
                <IoLogOutOutline className="group-hover:translate-x-2 duration-200 ease-linear text-xl group-hover:animate-pulse" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className=" px-8 py-2 border-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity rounded-md"
              >
                Log in
              </button>
              <button
                type="button"
                className="bg-black text-white rounded-md px-8 py-2 font-bold hover:opacity-80 duration-200 ease-in-out transition-opacity"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
